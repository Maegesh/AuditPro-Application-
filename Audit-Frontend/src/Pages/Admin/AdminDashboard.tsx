import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Users, Building2, CheckSquare, PlusCircle, ThumbsUp } from 'lucide-react'
import StatCard from '@/Components/shared/StatCard'
import QuickActionCard from '@/Components/shared/QuickActionCard'
import { getAllUsers } from '@/Services/userService'
import { getDepartments } from '@/Services/departmentService'
import { getAdminAudits } from '@/Services/auditService'

const quickActions = [
  { label: 'Create Audit', icon: PlusCircle, to: '/admin/audits', description: 'Schedule a new audit and assign an auditor' },
  { label: 'Add User', icon: Users, to: '/admin/users', description: 'Create a new Auditor or Employee account' },
  { label: 'Add Department', icon: Building2, to: '/admin/departments', description: 'Register a new department' },
  { label: 'Observations & Actions', icon: CheckSquare, to: '/admin/corrective-actions', description: 'View observations and track corrective actions' },
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

  const name = localStorage.getItem('name') ?? 'Admin'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {name}</h2>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your audit management system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(({ label, icon, to, description }) => (
            <QuickActionCard key={label} label={label} icon={icon} description={description} onClick={() => navigate(to)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
