import client from './client'
import type { Role } from '../types'

export const getRoles = () => client.get<Role[]>('/roles').then(r => r.data)
export const getRole = (id: number) => client.get<Role>(`/roles/${id}`).then(r => r.data)
export const createRole = (data: { name: string; description?: string }) => client.post<Role>('/roles', data).then(r => r.data)
export const updateRole = (id: number, data: Partial<Role>) => client.put(`/roles/${id}`, data)
export const assignRolePermissions = (roleId: number, permissionIds: number[]) =>
  client.post(`/roles/${roleId}/permissions`, { roleId, permissionIds })
export const cloneRole = (id: number, newName: string) => client.post(`/roles/${id}/clone`, { newName })
