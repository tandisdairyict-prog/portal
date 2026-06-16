import client from './client'
import type { LoginResponse } from '../types'

export const login = (username: string, password: string) =>
  client.post<LoginResponse>('/auth/login', { username, password }).then(r => r.data)
