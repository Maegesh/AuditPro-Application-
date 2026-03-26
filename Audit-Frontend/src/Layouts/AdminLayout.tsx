import React from 'react'
import DashboardLayout from './DashboardLayout'
import Sidebar from '@/Components/admin/Sidebar'
import Navbar from '@/Components/admin/Navbar'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/audits': 'Audits',
  '/admin/users': 'Users',
  '/admin/departments': 'Departments',
  '/admin/corrective-actions': 'Observations & Actions',
}

const AdminLayout: React.FC = () => (
  <DashboardLayout
    sidebar={<Sidebar />}
    navbar={(title) => <Navbar title={title} />}
    pageTitles={pageTitles}
    fallbackTitle="Admin"
  />
)

export default AdminLayout
