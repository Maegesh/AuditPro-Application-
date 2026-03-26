import React from 'react'
import { LayoutDashboard, ClipboardList, Users, Building2, CheckSquare } from 'lucide-react'
import AppSidebar from '@/Components/shared/AppSidebar'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/audits', label: 'Audits', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/corrective-actions', label: 'Observations & Actions', icon: CheckSquare },
]

const Sidebar: React.FC = () => (
  <AppSidebar panelLabel="Admin Panel" role="Admin" navItems={navItems} />
)

export default Sidebar
