import React, { useEffect, useState } from 'react'
import { Building2, PlusCircle } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import Modal from '@/Components/shared/Modal'
import { createDepartment, getDepartments, type Department } from '@/Services/departmentService'

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDepartments = () =>
    getDepartments().then((res) => setDepartments(res.data)).catch(() => setDepartments([]))

  useEffect(() => { fetchDepartments() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Department name is required.'); return }
    setLoading(true); setError('')
    try {
      await createDepartment(name.trim())
      await fetchDepartments()
      setName(''); setShowModal(false)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create department.')
    } finally { setLoading(false) }
  }

  const closeModal = () => { setShowModal(false); setName(''); setError('') }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Departments</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage all departments in the organization.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" /> Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <EmptyState icon={Building2} message={<>No departments yet. Click <span className="font-medium text-slate-700">Add Department</span> to create one.</>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <Card key={d.departmentId} className="border-slate-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{d.departmentName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {d.departmentId}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Add Department" subtitle="Enter the name of the new department." onClose={closeModal} maxWidth="max-w-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm">Department Name</Label>
              <Input placeholder="e.g. Finance, IT, HR" value={name} onChange={(e) => setName(e.target.value)} className="h-10" autoFocus />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Departments
