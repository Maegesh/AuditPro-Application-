import api from './api'

export interface Department {
  departmentId: number
  departmentName: string
}

export const getDepartments = () =>
  api.get<Department[]>('/departments')

export const createDepartment = (departmentName: string) =>
  api.post('/departments', { departmentName })
