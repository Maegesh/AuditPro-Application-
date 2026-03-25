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

export interface CorrectiveAction {
  actionId: number
  observationId: number
  assignedToUserId: number
  actionDescription: string
  rootCause: string
  expectedOutcome: string
  dueDate: string
  status: string
  proofFileData?: string
  proofFileName?: string
}

export const getCorrectiveActions = (observationId: number) =>
  api.get<CorrectiveAction[]>(`/actions/${observationId}`)

export const addCorrectiveAction = (payload: CorrectiveActionPayload) =>
  api.post('/actions', payload)

export const getMyActions = () =>
  api.get<CorrectiveAction[]>('/actions/my')

export const updateActionStatus = (actionId: number, status: string) =>
  api.put(`/actions/${actionId}/status`, { status })
