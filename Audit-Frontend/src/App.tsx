import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Authentication/Login'
import EmployeeDashboard from './Pages/Employee/EmployeeDashboard'
import AuditorDashboard from './Pages/Auditor/AuditorDashboard'
import AdminLayout from './Layouts/AdminLayout'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import Users from './Pages/Admin/Users'
import Departments from './Pages/Admin/Departments'
import Audits from './Pages/Admin/Audits'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/auditor" element={<AuditorDashboard />} />

        {/* Admin routes — all share AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="audits" element={<Audits />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="observations" element={<div className="text-slate-500 p-4">Observations page — coming soon</div>} />
          <Route path="corrective-actions" element={<div className="text-slate-500 p-4">Corrective Actions page — coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
