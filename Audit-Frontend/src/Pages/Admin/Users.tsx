import React, { useEffect, useState } from 'react'
import { UserPlus, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import Modal from '@/Components/shared/Modal'
import { roleColors } from '@/lib/constants'
import { createUser, getAllUsers, type CreateUserPayload, type User } from '@/Services/userService'
import { getDepartments, type Department } from '@/Services/departmentService'

interface FormState {
  name: string; email: string; role: 'Auditor' | 'Employee'; departmentId: string; expertise: string
}

const defaultForm: FormState = { name: '', email: '', role: 'Auditor', departmentId: '', expertise: '' }

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchUsers = () => getAllUsers().then((res) => setUsers(res.data)).catch(() => setUsers([]))

  useEffect(() => {
    fetchUsers()
    getDepartments().then((res) => setDepartments(res.data)).catch(() => setDepartments([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!form.name || !form.email || !form.departmentId || !form.expertise) { setError('All fields are required.'); return }
    setLoading(true)
    try {
      const payload: CreateUserPayload = { name: form.name, email: form.email, role: form.role, departmentId: Number(form.departmentId), expertise: form.expertise }
      await createUser(payload)
      setSuccess(`${form.role} account created. Login credentials sent to ${form.email}.`)
      setForm(defaultForm)
      await fetchUsers()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create user. Please try again.')
    } finally { setLoading(false) }
  }

  const closeModal = () => { setShowModal(false); setForm(defaultForm); setError(''); setSuccess('') }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Users</h2>
          <p className="text-slate-500 text-sm mt-0.5">Create and manage Auditor & Employee accounts.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState icon={UsersIcon} message={<>No users yet. Click <span className="font-medium text-slate-700">Add User</span> to create one.</>} />
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Expertise</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.userId} className={i !== users.length - 1 ? 'border-b border-slate-50' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[u.role] ?? 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.expertise ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {showModal && (
        <Modal title="Add New User" subtitle="Login credentials will be emailed to the user." onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['Auditor', 'Employee'] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${form.role === r ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Full Name</Label>
              <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Email Address</Label>
              <Input name="email" type="email" placeholder="john@company.com" value={form.email} onChange={handleChange} className="h-10" />
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
              <Label className="text-slate-700 text-sm">Expertise</Label>
              <Input name="expertise" placeholder="e.g. Financial Audit, IT Compliance" value={form.expertise} onChange={handleChange} className="h-10" />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}
            {success && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">{success}</p>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Creating...' : `Create ${form.role}`}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Users
