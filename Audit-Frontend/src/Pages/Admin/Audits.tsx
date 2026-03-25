import React, { useEffect, useState } from 'react'
import { ClipboardList, PlusCircle, Calendar } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import Modal from '@/Components/shared/Modal'
import { statusColors } from '@/lib/constants'
import { getDepartments, type Department } from '@/Services/departmentService'
import { getAuditorsByDepartment, createAudit, getAdminAudits, approveAudit, type Auditor, type Audit } from '@/Services/auditService'

interface FormState {
  auditName: string
  departmentId: string
  auditorId: string
  startDate: string
  endDate: string
}

const defaultForm: FormState = { auditName: '', departmentId: '', auditorId: '', startDate: '', endDate: '' }

const STATUS_FILTERS = ['All', 'Scheduled', 'InProgress', 'PendingApproval', 'Completed']

const Audits: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [auditors, setAuditors] = useState<Auditor[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const fetchAudits = () =>
    getAdminAudits().then((res) => setAudits(res.data)).catch(() => setAudits([]))

  useEffect(() => {
    fetchAudits()
    getDepartments().then((res) => setDepartments(res.data)).catch(() => setDepartments([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'departmentId' && value) {
      setForm((prev) => ({ ...prev, departmentId: value, auditorId: '' }))
      getAuditorsByDepartment(Number(value)).then((res) => setAuditors(res.data)).catch(() => setAuditors([]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.auditName || !form.departmentId || !form.auditorId || !form.startDate || !form.endDate) {
      setError('All fields are required.'); return
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError('End date must be after start date.'); return
    }
    setLoading(true); setError('')
    try {
      await createAudit({ auditName: form.auditName, departmentId: Number(form.departmentId), auditorId: Number(form.auditorId), startDate: form.startDate, endDate: form.endDate, status: 'Scheduled' })
      await fetchAudits()
      setForm(defaultForm); setAuditors([]); setShowModal(false)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create audit.')
    } finally { setLoading(false) }
  }

  const handleApprove = async (auditId: number) => {
    try {
      await approveAudit(auditId)
      await fetchAudits()
    } catch {}
  }

  const closeModal = () => { setShowModal(false); setForm(defaultForm); setAuditors([]); setError('') }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Audits</h2>
          <p className="text-slate-500 text-sm mt-0.5">Create and manage audits assigned to auditors.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" /> Create Audit
        </Button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'InProgress' ? 'In Progress' : s === 'PendingApproval' ? 'Pending Approval' : s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by audit name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-auto sm:w-56"
        />
      </div>

      {(() => {
        const filtered = audits
          .filter((a) => statusFilter === 'All' || a.status === statusFilter)
          .filter((a) => a.auditName.toLowerCase().includes(search.toLowerCase()))
        return filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} message={audits.length === 0 ? <>No audits yet. Click <span className="font-medium text-slate-700">Create Audit</span> to get started.</> : 'No audits match the selected filter.'} />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <Card key={a.auditId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{a.auditName}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{a.startDate ?? '—'} → {a.endDate ?? '—'}</span>
                </div>
                {a.status === 'PendingApproval' && (
                  <div className="border-t border-slate-100 pt-3">
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleApprove(a.auditId)}
                    >
                      Approve Audit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        )
      })()}

      {showModal && (
        <Modal title="Create Audit" subtitle="Assign an audit to an auditor." onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Audit Name</Label>
              <Input name="auditName" placeholder="e.g. Q1 Financial Audit" value={form.auditName} onChange={handleChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Department</Label>
              <select name="departmentId" value={form.departmentId} onChange={handleChange}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Assign Auditor</Label>
              <select name="auditorId" value={form.auditorId} onChange={handleChange} disabled={!form.departmentId}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">{!form.departmentId ? 'Select a department first' : auditors.length === 0 ? 'No auditors in this department' : 'Select auditor'}</option>
                {auditors.map((a) => <option key={a.userId} value={a.userId}>{a.name} — {a.expertise}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Start Date</Label>
                <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="h-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">End Date</Label>
                <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="h-10" />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Creating...' : 'Create Audit'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Audits
