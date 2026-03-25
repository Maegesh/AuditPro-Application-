import React from 'react'
import DashboardLayout from './DashboardLayout'
import EmployeeSidebar from '@/Components/employee/EmployeeSidebar'
import EmployeeNavbar from '@/Components/employee/EmployeeNavbar'

const pageTitles: Record<string, string> = {
  '/employee': 'Dashboard',
  '/employee/actions': 'My Actions',
  '/employee/profile': 'My Profile',
}

const EmployeeLayout: React.FC = () => (
  <DashboardLayout
    sidebar={<EmployeeSidebar />}
    navbar={(title) => <EmployeeNavbar title={title} />}
    pageTitles={pageTitles}
    fallbackTitle="Employee"
  />
)

export default EmployeeLayout
