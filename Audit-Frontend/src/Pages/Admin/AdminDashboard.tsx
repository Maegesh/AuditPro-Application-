import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Users, Building2, Eye, CheckSquare, PlusCircle, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { getAllUsers, getDepartments } from '@/Services/userService'
import { getAdminAudits } from '@/Services/auditService'

const quickActions = [
  { label: 'Create Audit', icon: PlusCircle, to: '/admin/audits', description: 'Schedule a new audit and assign an auditor' },
  { label: 'Add User', icon: Users, to: '/admin/users', description: 'Create a new Auditor or Employee account' },
  { label: 'Add Department', icon: Building2, to: '/admin/departments', description: 'Register a new department' },
  { label: 'View Observations', icon: Eye, to: '/admin/observations', description: 'Review audit observations' },
  { label: 'Corrective Actions', icon: CheckSquare, to: '/admin/corrective-actions', description: 'Assign and track corrective actions' },
  { label: 'Approve Audits', icon: ThumbsUp, to: '/admin/audits', description: 'Approve submitted audits' },
]

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ audits: '—', users: '—', departments: '—', pending: '—' })

  useEffect(() => {
    Promise.allSettled([getAdminAudits(), getAllUsers(), getDepartments()]).then(([auditsRes, usersRes, deptsRes]) => {
      const audits = auditsRes.status === 'fulfilled' ? auditsRes.value.data : []
      const users = usersRes.status === 'fulfilled' ? usersRes.value.data : []
      const depts = deptsRes.status === 'fulfilled' ? deptsRes.value.data : []
      setCounts({
        audits: String(audits.length),
        users: String(users.length),
        departments: String(depts.length),
        pending: String(audits.filter((a: any) => a.status === 'PendingApproval').length),
      })
    })
  }, [])

  const stats = [
    { label: 'Total Audits', value: counts.audits, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: 'Users', value: counts.users, icon: Users, color: 'bg-violet-50 text-violet-600' },
    { label: 'Departments', value: counts.departments, icon: Building2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Approvals', value: counts.pending, icon: ThumbsUp, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin</h2>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your audit management system.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(({ label, icon: Icon, to, description }) => (
            <Card
              key={label}
              className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(to)}
            >
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm text-slate-800">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
                <Button size="sm" variant="ghost" className="mt-3 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent text-xs font-medium h-auto">
                  Go →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
