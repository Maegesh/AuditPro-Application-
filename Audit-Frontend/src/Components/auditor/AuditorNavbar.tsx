import React from 'react'
import AppNavbar from '@/Components/shared/AppNavbar'

const AuditorNavbar: React.FC<{ title: string }> = ({ title }) => (
  <AppNavbar title={title} role="Auditor" />
)

export default AuditorNavbar
