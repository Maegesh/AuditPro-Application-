import React from 'react'
import { LayoutDashboard, CheckSquare, UserCircle } from 'lucide-react'
import AppSidebar from '@/Components/shared/AppSidebar'

const navItems = [
  { to: '/employee', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employee/actions', label: 'My Actions', icon: CheckSquare },
  { to: '/employee/profile', label: 'My Profile', icon: UserCircle },
]

const EmployeeSidebar: React.FC = () => (
  <AppSidebar panelLabel="Employee Panel" role="Employee" navItems={navItems} />
)

export default EmployeeSidebar
