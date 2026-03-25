import React from 'react'
import { LayoutDashboard, ClipboardList, Eye, UserCircle } from 'lucide-react'
import AppSidebar from '@/Components/shared/AppSidebar'

const navItems = [
  { to: '/auditor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/auditor/audits', label: 'My Audits', icon: ClipboardList },
  { to: '/auditor/observations', label: 'Observations', icon: Eye },
  { to: '/auditor/profile', label: 'My Profile', icon: UserCircle },
]

const AuditorSidebar: React.FC = () => (
  <AppSidebar panelLabel="Auditor Panel" role="Auditor" navItems={navItems} />
)

export default AuditorSidebar
