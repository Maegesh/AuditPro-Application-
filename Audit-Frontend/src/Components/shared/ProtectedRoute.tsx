import { Navigate, Outlet } from 'react-router-dom'

interface Props {
  allowedRole: string
}

const ProtectedRoute: React.FC<Props> = ({ allowedRole }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || !role) return <Navigate to="/" replace />
  if (role !== allowedRole) return <Navigate to="/" replace />

  return <Outlet />
}

export default ProtectedRoute
