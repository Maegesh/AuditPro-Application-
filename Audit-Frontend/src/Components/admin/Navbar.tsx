import React from 'react'
import AppNavbar from '@/Components/shared/AppNavbar'

const Navbar: React.FC<{ title: string }> = ({ title }) => (
  <AppNavbar title={title} role="Admin" />
)

export default Navbar
