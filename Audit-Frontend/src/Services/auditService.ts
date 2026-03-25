import api from './api'

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
  auditorName: string
  auditorEmail: string
  departmentName: string
  createdBy: string
  createdAt: string | null
}

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
