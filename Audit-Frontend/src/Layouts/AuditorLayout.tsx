import React from 'react'
import DashboardLayout from './DashboardLayout'
import AuditorSidebar from '@/Components/auditor/AuditorSidebar'
import AuditorNavbar from '@/Components/auditor/AuditorNavbar'

const pageTitles: Record<string, string> = {
  '/auditor': 'Dashboard',
  '/auditor/audits': 'My Audits',
  '/auditor/observations': 'Observations',
  '/auditor/profile': 'My Profile',
}

const AuditorLayout: React.FC = () => (
  <DashboardLayout
    sidebar={<AuditorSidebar />}
    navbar={(title) => <AuditorNavbar title={title} />}
    pageTitles={pageTitles}
    fallbackTitle="Auditor"
  />
)

export default AuditorLayout
