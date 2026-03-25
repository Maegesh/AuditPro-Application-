import api from './api'

export interface CorrectiveActionPayload {
  observationId: number
  assignedToUserId: number
  actionDescription: string
  rootCause: string
  expectedOutcome: string
  dueDate: string
  status: string
}

export const getCorrectiveActions = (observationId: number) =>
  api.get(`/actions/${observationId}`)

export const addCorrectiveAction = (payload: CorrectiveActionPayload) =>
  api.post('/actions', payload)

export const getMyActions = () =>
  api.get('/actions/my')

export const updateActionStatus = (actionId: number, status: string) =>
  api.put(`/actions/${actionId}/status`, { status })
