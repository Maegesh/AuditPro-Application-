import React from 'react'
import AppNavbar from '@/Components/shared/AppNavbar'

const EmployeeNavbar: React.FC<{ title: string }> = ({ title }) => (
  <AppNavbar title={title} role="Employee" />
)

export default EmployeeNavbar
