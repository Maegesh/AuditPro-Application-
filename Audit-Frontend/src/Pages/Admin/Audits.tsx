import React, { useEffect, useState } from 'react'
import { ClipboardList, PlusCircle, X, Calendar } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import { getDepartments, type Department } from '@/Services/userService'
import { getAuditorsByDepartment, createAudit, getAdminAudits, type Auditor, type Audit } from '@/Services/auditService'

interface FormState {
  auditName: string
  departmentId: string
  auditorId: string
  startDate: string
  endDate: string
  status: string
}

const defaultForm: FormState = {
  auditName: '',
  departmentId: '',
  auditorId: '',
  startDate: '',
  endDate: '',
  status: 'Scheduled',
}

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-700',
  InProgress: 'bg-amber-50 text-amber-700',
  PendingApproval: 'bg-violet-50 text-violet-700',
  Completed: 'bg-emerald-50 text-emerald-700',
}

const Audits: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [auditors, setAuditors] = useState<Auditor[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAudits = () =>
    getAdminAudits()
      .then((res) => setAudits(res.data))
      .catch(() => setAudits([]))

  useEffect(() => {
    fetchAudits()
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'departmentId' && value) {
      setForm((prev) => ({ ...prev, departmentId: value, auditorId: '' }))
      getAuditorsByDepartment(Number(value))
        .then((res) => setAuditors(res.data))
        .catch(() => setAuditors([]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.auditName || !form.departmentId || !form.auditorId || !form.startDate || !form.endDate) {
      setError('All fields are required.')
      return
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError('End date must be after start date.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createAudit({
        auditName: form.auditName,
        departmentId: Number(form.departmentId),
        auditorId: Number(form.auditorId),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      })
      await fetchAudits()
      setForm(defaultForm)
      setAuditors([])
      setShowModal(false)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create audit.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setForm(defaultForm)
    setAuditors([])
    setError('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Audits</h2>
          <p className="text-slate-500 text-sm mt-0.5">Create and manage audits assigned to auditors.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Audit
        </Button>
      </div>

      {/* Audit List */}
      {audits.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">
              No audits yet. Click <span className="font-medium text-slate-700">Create Audit</span> to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {audits.map((a) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Audit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Create Audit</h3>
                <p className="text-xs text-slate-500 mt-0.5">Assign an audit to an auditor.</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {/* Audit Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auditName" className="text-slate-700 text-sm">Audit Name</Label>
                <Input
                  id="auditName"
                  name="auditName"
                  placeholder="e.g. Q1 Financial Audit"
                  value={form.auditName}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>

              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="departmentId" className="text-slate-700 text-sm">Department</Label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              {/* Auditor — only shown after department is selected */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auditorId" className="text-slate-700 text-sm">Assign Auditor</Label>
                <select
                  id="auditorId"
                  name="auditorId"
                  value={form.auditorId}
                  onChange={handleChange}
                  disabled={!form.departmentId}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!form.departmentId ? 'Select a department first' : auditors.length === 0 ? 'No auditors in this department' : 'Select auditor'}
                  </option>
                  {auditors.map((a) => (
                    <option key={a.userId} value={a.userId}>{a.name} — {a.expertise}</option>
                  ))}
                </select>
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="startDate" className="text-slate-700 text-sm">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="endDate" className="text-slate-700 text-sm">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status" className="text-slate-700 text-sm">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="InProgress">In Progress</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-10" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 'Creating...' : 'Create Audit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Audits
