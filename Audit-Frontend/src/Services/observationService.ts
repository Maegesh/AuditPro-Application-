import api from './api'

export const getObservations = (auditId: number) =>
  api.get(`/observations/${auditId}`)

export const addObservation = (formData: FormData) =>
  api.post('/observations', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
