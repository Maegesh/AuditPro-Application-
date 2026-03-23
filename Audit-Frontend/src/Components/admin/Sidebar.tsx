import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Users, Building2, Eye, CheckSquare, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/audits', label: 'Audits', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/observations', label: 'Observations', icon: Eye },
  { to: '/admin/corrective-actions', label: 'Corrective Actions', icon: CheckSquare },
]

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-base tracking-tight">AuditPro</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Admin Panel</p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-[11px]">Role: <span className="text-slate-300 font-medium">Admin</span></p>
      </div>
    </aside>
  )
}

export default Sidebar
