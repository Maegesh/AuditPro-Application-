import React, { useEffect, useState } from 'react'
import { Building2, PlusCircle, X } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import { createDepartment, getDepartments, type Department } from '@/Services/userService'

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDepartments = () =>
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]))

  useEffect(() => { fetchDepartments() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Department name is required.'); return }
    setLoading(true)
    setError('')
    try {
      await createDepartment(name.trim())
      await fetchDepartments()
      setName('')
      setShowModal(false)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create department.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => { setShowModal(false); setName(''); setError('') }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Departments</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage all departments in the organization.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Department List */}
      {departments.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">
              No departments yet. Click <span className="font-medium text-slate-700">Add Department</span> to create one.
            </p>
          </CardContent>
        </Card>
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

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Add Department</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter the name of the new department.</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deptName" className="text-slate-700 text-sm">Department Name</Label>
                <Input
                  id="deptName"
                  placeholder="e.g. Finance, IT, HR"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-10" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Departments
