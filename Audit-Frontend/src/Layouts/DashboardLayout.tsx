import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

interface DashboardLayoutProps {
  sidebar: React.ReactNode
  navbar: (title: string) => React.ReactNode
  pageTitles: Record<string, string>
  fallbackTitle: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, navbar, pageTitles, fallbackTitle }) => {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? fallbackTitle

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0">
        {navbar(title)}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
