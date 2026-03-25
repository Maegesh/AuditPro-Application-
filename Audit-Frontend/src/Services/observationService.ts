import api from './api'

export interface Observation {
  observationId: number
  auditId: number
  title: string
  description: string
  areaOrLocation: string
  finding: string
  riskOrImpact: string
  recommendation: string
  severity: string
  dueDate: string
  proofFileData?: string
  proofFileName?: string
}

export const getObservations = (auditId: number) =>
  api.get<Observation[]>(`/observations/${auditId}`)

export const addObservation = (formData: FormData) =>
  api.post('/observations', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
