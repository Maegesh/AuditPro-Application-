import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/Components/admin/Sidebar'
import Navbar from '@/Components/admin/Navbar'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/audits': 'Audits',
  '/admin/users': 'Users',
  '/admin/departments': 'Departments',
  '/admin/observations': 'Observations',
  '/admin/corrective-actions': 'Corrective Actions',
}

const AdminLayout: React.FC = () => {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Admin'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
