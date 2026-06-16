import client from './client'
import type { User, PermissionTree, Manager } from '../types'

export const getUsers = () => client.get<User[]>('/users').then(r => r.data)
export const getUser = (id: number) => client.get<User>(`/users/${id}`).then(r => r.data)
export const createUser = (data: { username: string; email: string; password: string; firstName: string; lastName: string; personnelNumber?: string; nationalId?: string }) =>
  client.post<User>('/users', data).then(r => r.data)
export const updateUser = (id: number, data: Partial<User>) => client.put(`/users/${id}`, data)
export const deleteUser = (id: number) => client.delete(`/users/${id}`)
export const getUserPermissionTree = (id: number) => client.get<PermissionTree[]>(`/users/${id}/permissions/tree`).then(r => r.data)
export const getUserManager = (id: number) => client.get<Manager>(`/users/${id}/manager`).then(r => r.data)
