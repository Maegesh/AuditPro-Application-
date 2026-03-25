import api from './api'

export const updateProfile = (payload: { name?: string; password?: string; expertise?: string }) =>
  api.put('/users/me', payload)
