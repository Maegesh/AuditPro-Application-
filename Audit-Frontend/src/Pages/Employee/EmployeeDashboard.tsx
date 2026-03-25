import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import StatCard from '@/Components/shared/StatCard'
import QuickActionCard from '@/Components/shared/QuickActionCard'
import { getMyActions } from '@/Services/correctiveActionService'

const quickActions = [
  { label: 'My Actions', icon: CheckSquare, to: '/employee/actions', description: 'View all corrective actions assigned to you' },
  { label: 'Pending Actions', icon: Clock, to: '/employee/actions?status=Open', description: 'Actions that are open and awaiting your response' },
  { label: 'In Progress', icon: AlertCircle, to: '/employee/actions?status=InProgress', description: 'Actions you are currently working on' },
  { label: 'Resolved', icon: CheckCircle, to: '/employee/actions?status=Resolved', description: 'Actions you have successfully resolved' },
]

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ total: '—', open: '—', inProgress: '—', resolved: '—' })

  useEffect(() => {
    getMyActions()
      .then((res) => {
        const actions = res.data
        setCounts({
          total: String(actions.length),
          open: String(actions.filter((a: any) => a.status === 'Open').length),
          inProgress: String(actions.filter((a: any) => a.status === 'InProgress').length),
          resolved: String(actions.filter((a: any) => a.status === 'Resolved').length),
        })
      })
      .catch(() => setCounts({ total: '0', open: '0', inProgress: '0', resolved: '0' }))
  }, [])

  const stats = [
    { label: 'Total Assigned', value: counts.total, icon: CheckSquare, color: 'bg-blue-50 text-blue-600' },
    { label: 'Open', value: counts.open, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'In Progress', value: counts.inProgress, icon: AlertCircle, color: 'bg-violet-50 text-violet-600' },
    { label: 'Resolved', value: counts.resolved, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  ]

  const name = localStorage.getItem('name') ?? 'Employee'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {name}</h2>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your assigned corrective actions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ label, icon, to, description }) => (
            <QuickActionCard key={label} label={label} icon={icon} description={description} onClick={() => navigate(to)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
