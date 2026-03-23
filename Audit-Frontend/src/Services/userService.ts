import api from './api'

export interface CreateUserPayload {
  name: string
  email: string
  role: 'Auditor' | 'Employee'
  departmentId: number
  expertise: string
}

export interface Department {
  departmentId: number
  departmentName: string
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

export const getDepartments = () =>
  api.get<Department[]>('/departments')

export const createDepartment = (departmentName: string) =>
  api.post('/departments', { departmentName })

export const getAllUsers = () =>
  api.get<User[]>('/users')
