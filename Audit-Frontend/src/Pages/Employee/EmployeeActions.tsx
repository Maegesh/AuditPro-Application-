import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckSquare } from 'lucide-react'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Label } from '@/Components/ui/label'
import EmptyState from '@/Components/shared/EmptyState'
import Modal from '@/Components/shared/Modal'
import { statusColors } from '@/lib/constants'
import { getMyActions, updateActionStatus } from '@/Services/correctiveActionService'

interface CorrectiveAction {
  actionId: number
  observationId: number
  actionDescription: string
  rootCause: string
  expectedOutcome: string
  dueDate: string
  status: string
  proofFilePath?: string
}

const BACKEND_URL = 'http://localhost:5000'

const EmployeeActions: React.FC = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([])
  const [showModal, setShowModal] = useState<CorrectiveAction | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownloadPdf = async (actionId: number) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/actions/${actionId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CorrectiveAction_${actionId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to download PDF.')
    }
  }
  const location = useLocation()
  const statusFilter = new URLSearchParams(location.search).get('status') ?? ''

  const fetchActions = () =>
    getMyActions()
      .then((res) => setActions(res.data))
      .catch(() => setActions([]))

  useEffect(() => { fetchActions() }, [])

  const openModal = (action: CorrectiveAction) => {
    setShowModal(action)
    setSelectedStatus(action.status)
    setError('')
  }

  const handleUpdateStatus = async () => {
    if (!showModal) return
    setLoading(true)
    setError('')
    try {
      await updateActionStatus(showModal.actionId, selectedStatus)
      await fetchActions()
      setShowModal(null)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to update status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Actions</h2>
        <p className="text-slate-500 text-sm mt-0.5">View and update the status of corrective actions assigned to you.</p>
      </div>

      {(statusFilter ? actions.filter((a) => a.status === statusFilter) : actions).length === 0 ? (
        <EmptyState icon={CheckSquare} message="No corrective actions assigned to you yet." />
      ) : (
        <div className="flex flex-col gap-4">
          {(statusFilter ? actions.filter((a) => a.status === statusFilter) : actions).map((a) => (
            <Card key={a.actionId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{a.actionDescription}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Observation #{a.observationId}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {a.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-2 gap-1">
                  <span><span className="font-medium text-slate-600">Root Cause:</span> {a.rootCause}</span>
                  <span><span className="font-medium text-slate-600">Due:</span> {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</span>
                  <span className="col-span-2"><span className="font-medium text-slate-600">Expected Outcome:</span> {a.expectedOutcome}</span>
                </div>

                <div className="flex items-center gap-3">
                  {a.proofFilePath && (
                    <a href={`${BACKEND_URL}${a.proofFilePath}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline">
                      📄 View Proof PDF
                    </a>
                  )}
                  <button onClick={() => handleDownloadPdf(a.actionId)}
                    className="text-xs text-emerald-600 hover:underline">
                    ⬇ Download Action PDF
                  </button>
                </div>

                {a.status !== 'Resolved' && (
                  <div className="border-t border-slate-100 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => openModal(a)}
                    >
                      Update Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {showModal && (
        <Modal title="Update Status" subtitle="Change the status of this corrective action." onClose={() => setShowModal(null)} maxWidth="max-w-sm">
          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{showModal.actionDescription}</p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-slate-700 text-sm">New Status</Label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowModal(null)}>Cancel</Button>
            <Button type="button" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateStatus}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default EmployeeActions
