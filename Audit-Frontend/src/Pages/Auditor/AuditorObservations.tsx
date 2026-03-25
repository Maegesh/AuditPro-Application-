import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, PlusCircle, ClipboardList, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import Modal from '@/Components/shared/Modal'
import { severityColors, statusColors } from '@/lib/constants'
import {
  getAuditorAudits,
  type Audit,
} from '@/Services/auditService'
import { getObservations, addObservation } from '@/Services/observationService'
import { addCorrectiveAction, getCorrectiveActions } from '@/Services/correctiveActionService'
import { getEmployees, type User } from '@/Services/userService'

interface Observation {
  observationId: number
  title: string
  description: string
  areaOrLocation: string
  finding: string
  riskOrImpact: string
  recommendation: string
  severity: string
  dueDate: string
  proofFileData?: string
  proofFileName?: string
}

interface CorrectiveAction {
  actionId: number
  actionDescription: string
  rootCause: string
  expectedOutcome: string
  dueDate: string
  status: string
  assignedToUserId: number
}

const defaultObsForm = {
  title: '', description: '', areaOrLocation: '', finding: '',
  riskOrImpact: '', recommendation: '', severity: 'Medium', dueDate: '',
}

const defaultActionForm = {
  actionDescription: '', rootCause: '', expectedOutcome: '', dueDate: '',
  status: 'Open', assignedToUserId: '',
}

const AuditorObservations: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [audits, setAudits] = useState<Audit[]>([])
  const [selectedAuditId, setSelectedAuditId] = useState<string>(searchParams.get('auditId') ?? '')
  const [observations, setObservations] = useState<Observation[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [showObsModal, setShowObsModal] = useState(false)
  const [obsForm, setObsForm] = useState(defaultObsForm)
  const [obsLoading, setObsLoading] = useState(false)
  const [obsError, setObsError] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)

  const [expandedObs, setExpandedObs] = useState<number | null>(null)
  const [actionsMap, setActionsMap] = useState<Record<number, CorrectiveAction[]>>({})
  const [showActionModal, setShowActionModal] = useState<number | null>(null)
  const [actionForm, setActionForm] = useState(defaultActionForm)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAuditorAudits().then((res) => setAudits(res.data)).catch(() => setAudits([]))
    getEmployees().then((res) => setEmployees(res.data)).catch(() => setEmployees([]))
  }, [])

  useEffect(() => {
    if (selectedAuditId) {
      getObservations(Number(selectedAuditId))
        .then((res) => {
          setObservations(res.data)
          setActionsMap({})
          res.data.forEach((o: Observation) => loadActions(o.observationId))
        })
        .catch(() => setObservations([]))
      // pre-fill due date with audit end date
      const audit = audits.find((a) => String(a.auditId) === selectedAuditId)
      if (audit?.endDate) {
        setObsForm((prev) => ({ ...prev, dueDate: audit.endDate!.split('T')[0] }))
      }
    } else {
      setObservations([])
      setActionsMap({})
    }
  }, [selectedAuditId])

  const loadActions = (observationId: number) => {
    getCorrectiveActions(observationId)
      .then((res) => setActionsMap((prev) => ({ ...prev, [observationId]: res.data })))
      .catch(() => setActionsMap((prev) => ({ ...prev, [observationId]: [] })))
  }

  const toggleExpand = (observationId: number) => {
    if (expandedObs === observationId) {
      setExpandedObs(null)
    } else {
      setExpandedObs(observationId)
      if (!actionsMap[observationId]) loadActions(observationId)
    }
  }

  const selectedAudit = audits.find((a) => String(a.auditId) === selectedAuditId)
  const auditEndDate = selectedAudit?.endDate?.split('T')[0] ?? ''
  const isCompleted = selectedAudit?.status === 'Completed'

  const handleObsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setObsForm((prev) => ({ ...prev, [name]: value }))
  }

  const today = new Date().toISOString().split('T')[0]

  const handleObsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAuditId) { setObsError('Please select an audit first.'); return }
    if (!obsForm.title || !obsForm.description || !obsForm.areaOrLocation || !obsForm.finding || !obsForm.riskOrImpact || !obsForm.recommendation || !obsForm.dueDate) {
      setObsError('All fields are required.'); return
    }
    if (obsForm.dueDate < today) {
      setObsError('Due date cannot be in the past.'); return
    }
    if (auditEndDate && obsForm.dueDate > auditEndDate) {
      setObsError(`Due date cannot exceed audit end date (${auditEndDate}).`); return
    }
    setObsLoading(true); setObsError('')
    try {
      const formData = new FormData()
      formData.append('auditId', String(selectedAuditId))
      formData.append('title', obsForm.title)
      formData.append('description', obsForm.description)
      formData.append('areaOrLocation', obsForm.areaOrLocation)
      formData.append('finding', obsForm.finding)
      formData.append('riskOrImpact', obsForm.riskOrImpact)
      formData.append('recommendation', obsForm.recommendation)
      formData.append('severity', obsForm.severity)
      formData.append('dueDate', obsForm.dueDate)
      if (proofFile) formData.append('proofFile', proofFile)
      await addObservation(formData)
      await getObservations(Number(selectedAuditId)).then((res) => setObservations(res.data))
      setObsForm(defaultObsForm); setProofFile(null); setShowObsModal(false)
    } catch (err: any) {
      setObsError(err?.response?.data?.message ?? 'Failed to add observation.')
    } finally { setObsLoading(false) }
  }

  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActionForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleActionSubmit = async (e: React.FormEvent, observationId: number) => {
    e.preventDefault()
    if (!actionForm.actionDescription || !actionForm.rootCause || !actionForm.expectedOutcome || !actionForm.dueDate || !actionForm.assignedToUserId) {
      setActionError('All fields are required.'); return
    }
    if (actionForm.dueDate < today) {
      setActionError('Due date cannot be in the past.'); return
    }
    setActionLoading(true); setActionError('')
    try {
      await addCorrectiveAction({
        observationId,
        assignedToUserId: Number(actionForm.assignedToUserId),
        actionDescription: actionForm.actionDescription,
        rootCause: actionForm.rootCause,
        expectedOutcome: actionForm.expectedOutcome,
        dueDate: actionForm.dueDate,
        status: actionForm.status,
      })
      loadActions(observationId)
      setActionForm(defaultActionForm); setShowActionModal(null)
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? 'Failed to assign corrective action.')
    } finally { setActionLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Observations</h2>
          <p className="text-slate-500 text-sm mt-0.5">Record findings and assign corrective actions to employees.</p>
        </div>
        {!isCompleted && (
          <Button
            onClick={() => { if (!selectedAuditId) { setError('Select an audit first.'); return } setShowObsModal(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Observation
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <Label className="text-slate-700 text-sm">Select Audit</Label>
        <select
          value={selectedAuditId}
          onChange={(e) => { setSelectedAuditId(e.target.value); setError('') }}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an audit</option>
          {audits.map((a) => (
            <option key={a.auditId} value={a.auditId}>{a.auditName}</option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {isCompleted && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckSquare className="w-4 h-4 flex-shrink-0" />
          This audit is <span className="font-semibold">Completed</span>. Observations and corrective actions are read-only.
        </div>
      )}

      {!selectedAuditId ? (
        <EmptyState icon={ClipboardList} message="Select an audit to view or add observations." />
      ) : observations.length === 0 ? (
        <EmptyState icon={Eye} message={<>No observations yet. Click <span className="font-medium text-slate-700">Add Observation</span> to start.</>} />
      ) : (
        <div className="flex flex-col gap-4">
          {observations.map((o) => (
            <Card key={o.observationId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{o.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{o.description}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${severityColors[o.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                    {o.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-2 gap-1">
                  <span><span className="font-medium text-slate-600">Location:</span> {o.areaOrLocation}</span>
                  <span><span className="font-medium text-slate-600">Due:</span> {o.dueDate}</span>
                  <span><span className="font-medium text-slate-600">Finding:</span> {o.finding}</span>
                  <span><span className="font-medium text-slate-600">Risk:</span> {o.riskOrImpact}</span>
                  <span className="col-span-2"><span className="font-medium text-slate-600">Recommendation:</span> {o.recommendation}</span>
                </div>

                {o.proofFileData && (
                  <a
                    href={`data:application/pdf;base64,${o.proofFileData}`}
                    download={o.proofFileName ?? 'proof.pdf'}
                    className="text-xs text-blue-600 hover:underline w-fit"
                  >
                    📄 Download {o.proofFileName ?? 'Proof Document'}
                  </a>
                )}

                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(o.observationId)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                      Corrective Actions ({actionsMap[o.observationId]?.length ?? 0})
                      {expandedObs === o.observationId ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => { setShowActionModal(o.observationId); setActionError('') }}
                      >
                        <PlusCircle className="w-3 h-3" />
                        Assign Action
                      </Button>
                    )}
                  </div>

                  {expandedObs === o.observationId && (
                    <div className="flex flex-col gap-2 mt-1">
                      {!actionsMap[o.observationId] || actionsMap[o.observationId].length === 0 ? (
                        <p className="text-xs text-slate-400 pl-1">No corrective actions assigned yet.</p>
                      ) : (
                        actionsMap[o.observationId].map((ca) => {
                          const emp = employees.find((e) => e.userId === ca.assignedToUserId)
                          return (
                            <div key={ca.actionId} className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 text-xs">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-700">{ca.actionDescription}</p>
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[ca.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                  {ca.status}
                                </span>
                              </div>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Assigned to:</span> {emp?.name ?? (ca.assignedToUserId ? `User #${ca.assignedToUserId}` : 'Unassigned')}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Root Cause:</span> {ca.rootCause}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Expected Outcome:</span> {ca.expectedOutcome}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Due:</span> {ca.dueDate ? new Date(ca.dueDate).toLocaleDateString() : '—'}</p>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showObsModal && (
        <Modal title="Add Observation" subtitle="Record a finding from your audit." onClose={() => { setShowObsModal(false); setObsForm(defaultObsForm); setProofFile(null); setObsError('') }} maxWidth="max-w-lg">
          <form onSubmit={handleObsSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Title</Label>
              <Input name="title" placeholder="e.g. Missing access controls" value={obsForm.title} onChange={handleObsChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Description</Label>
              <textarea name="description" placeholder="Describe the observation..." value={obsForm.description} onChange={handleObsChange} rows={2}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Area / Location</Label>
                <Input name="areaOrLocation" placeholder="e.g. Finance Dept" value={obsForm.areaOrLocation} onChange={handleObsChange} className="h-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Severity</Label>
                <select name="severity" value={obsForm.severity} onChange={handleObsChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Finding</Label>
              <Input name="finding" placeholder="What was found?" value={obsForm.finding} onChange={handleObsChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Risk / Impact</Label>
              <Input name="riskOrImpact" placeholder="What is the risk?" value={obsForm.riskOrImpact} onChange={handleObsChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Recommendation</Label>
              <Input name="recommendation" placeholder="Suggested action" value={obsForm.recommendation} onChange={handleObsChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Due Date</Label>
              <Input name="dueDate" type="date" value={obsForm.dueDate} onChange={handleObsChange} className="h-10" min={today} max={auditEndDate} />
              {auditEndDate && <p className="text-xs text-slate-400">Cannot exceed audit end date: {auditEndDate}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Proof Document (PDF) <span className="text-slate-400 font-normal">— optional</span></Label>
              <input type="file" accept="application/pdf" onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-slate-200 file:text-xs file:bg-white file:text-slate-700 hover:file:bg-slate-50" />
            </div>
            {obsError && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{obsError}</p>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => { setShowObsModal(false); setObsForm(defaultObsForm); setProofFile(null); setObsError('') }}>Cancel</Button>
              <Button type="submit" disabled={obsLoading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                {obsLoading ? 'Saving...' : 'Add Observation'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showActionModal !== null && (
        <Modal title="Assign Corrective Action" subtitle="Assign a corrective action to an employee." onClose={() => { setShowActionModal(null); setActionForm(defaultActionForm); setActionError('') }} maxWidth="max-w-lg">
          <form onSubmit={(e) => handleActionSubmit(e, showActionModal)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Assign To Employee</Label>
              <select name="assignedToUserId" value={actionForm.assignedToUserId} onChange={handleActionChange}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={e.userId} value={e.userId}>{e.name} — {e.expertise}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Action Description</Label>
              <textarea name="actionDescription" placeholder="Describe the corrective action..." value={actionForm.actionDescription} onChange={handleActionChange} rows={2}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Root Cause</Label>
              <Input name="rootCause" placeholder="What caused this issue?" value={actionForm.rootCause} onChange={handleActionChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Expected Outcome</Label>
              <Input name="expectedOutcome" placeholder="What should be achieved?" value={actionForm.expectedOutcome} onChange={handleActionChange} className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Due Date</Label>
                <Input name="dueDate" type="date" value={actionForm.dueDate} onChange={handleActionChange} className="h-10" min={today} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Status</Label>
                <select name="status" value={actionForm.status} onChange={handleActionChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                </select>
              </div>
            </div>
            {actionError && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{actionError}</p>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => { setShowActionModal(null); setActionForm(defaultActionForm); setActionError('') }}>Cancel</Button>
              <Button type="submit" disabled={actionLoading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                {actionLoading ? 'Assigning...' : 'Assign Action'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AuditorObservations
