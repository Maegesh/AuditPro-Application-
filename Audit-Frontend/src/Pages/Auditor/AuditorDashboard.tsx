import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Eye, PlusCircle, Send } from 'lucide-react'
import StatCard from '@/Components/shared/StatCard'
import QuickActionCard from '@/Components/shared/QuickActionCard'
import { getAuditorAudits } from '@/Services/auditService'

const quickActions = [
  { label: 'My Audits', icon: ClipboardList, to: '/auditor/audits', description: 'View all audits assigned to you' },
  { label: 'Add Observation', icon: PlusCircle, to: '/auditor/observations', description: 'Record findings from your audit' },
  { label: 'Submit Audit', icon: Send, to: '/auditor/audits', description: 'Submit completed audits for approval' },
  { label: 'View Observations', icon: Eye, to: '/auditor/observations', description: 'Review all observations you have added' },
]

const AuditorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ total: '—', inProgress: '—', pending: '—', completed: '—' })

  useEffect(() => {
    getAuditorAudits()
      .then((res) => {
        const audits = res.data
        setCounts({
          total: String(audits.length),
          inProgress: String(audits.filter((a: any) => a.status === 'InProgress').length),
          pending: String(audits.filter((a: any) => a.status === 'PendingApproval').length),
          completed: String(audits.filter((a: any) => a.status === 'Completed').length),
        })
      })
      .catch(() => setCounts({ total: '0', inProgress: '0', pending: '0', completed: '0' }))
  }, [])

  const stats = [
    { label: 'Total Assigned', value: counts.total, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: 'In Progress', value: counts.inProgress, icon: ClipboardList, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Approval', value: counts.pending, icon: Send, color: 'bg-violet-50 text-violet-600' },
    { label: 'Completed', value: counts.completed, icon: Eye, color: 'bg-emerald-50 text-emerald-600' },
  ]

  const name = localStorage.getItem('name') ?? 'Auditor'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {name}</h2>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your assigned audits and observations.</p>
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

export default AuditorDashboard
