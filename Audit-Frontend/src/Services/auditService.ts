import api from './api'

export interface Auditor {
  userId: number
  name: string
  email: string
  expertise: string
}

export interface AuditPayload {
  auditName: string
  departmentId: number
  auditorId: number
  startDate: string
  endDate: string
  status: string
}

export interface Audit {
  auditId: number
  auditName: string
  status: string
  startDate: string | null
  endDate: string | null
}

export const getAuditorsByDepartment = (departmentId: number) =>
  api.get<Auditor[]>(`/users/auditors?departmentId=${departmentId}`)

export const createAudit = (payload: AuditPayload) =>
  api.post('/audits', payload)

export const getAdminAudits = () =>
  api.get<Audit[]>('/audits/admin')

export const getAuditorAudits = () =>
  api.get<Audit[]>('/audits/auditor')

export const submitAudit = (auditId: number) =>
  api.put(`/audits/${auditId}/submit`)

export const approveAudit = (auditId: number) =>
  api.put(`/audits/${auditId}/approve`)
