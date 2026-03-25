import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Authentication/Login'
import ProtectedRoute from './Components/shared/ProtectedRoute'
import AdminLayout from './Layouts/AdminLayout'
import AuditorLayout from './Layouts/AuditorLayout'
import EmployeeLayout from './Layouts/EmployeeLayout'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import Users from './Pages/Admin/Users'
import Departments from './Pages/Admin/Departments'
import Audits from './Pages/Admin/Audits'
import AdminObservations from './Pages/Admin/AdminObservations'
import AdminCorrectiveActions from './Pages/Admin/AdminCorrectiveActions'
import AuditorDashboard from './Pages/Auditor/AuditorDashboard'
import AuditorAudits from './Pages/Auditor/AuditorAudits'
import AuditorObservations from './Pages/Auditor/AuditorObservations'
import EmployeeDashboard from './Pages/Employee/EmployeeDashboard'
import EmployeeActions from './Pages/Employee/EmployeeActions'
import Profile from './Pages/shared/Profile'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Employee routes */}
        <Route element={<ProtectedRoute allowedRole="Employee" />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="actions" element={<EmployeeActions />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Auditor routes */}
        <Route element={<ProtectedRoute allowedRole="Auditor" />}>
          <Route path="/auditor" element={<AuditorLayout />}>
            <Route index element={<AuditorDashboard />} />
            <Route path="audits" element={<AuditorAudits />} />
            <Route path="observations" element={<AuditorObservations />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="audits" element={<Audits />} />
            <Route path="users" element={<Users />} />
            <Route path="departments" element={<Departments />} />
            <Route path="observations" element={<AdminObservations />} />
            <Route path="corrective-actions" element={<AdminCorrectiveActions />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
