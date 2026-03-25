import api from './api'

export interface CreateUserPayload {
  name: string
  email: string
  role: 'Auditor' | 'Employee'
  departmentId: number
  expertise: string
}

export interface User {
  userId: number
  name: string
  email: string
  role: string
  departmentId: number
  expertise: string
}

export const createUser = (payload: CreateUserPayload) =>
  api.post('/users', payload)

export const getAllUsers = () =>
  api.get<User[]>('/users')

export const getAuditorsByDepartment = (departmentId: number) =>
  api.get<User[]>(`/users/auditors?departmentId=${departmentId}`)

export const getEmployees = () =>
  api.get<User[]>('/users/employees')

export const updateProfile = (payload: { name?: string; password?: string; expertise?: string }) =>
  api.put('/users/me', payload)
