import client from './client'
import type { Permission, PermissionTree } from '../types'

export const getPermissions = () => client.get<Permission[]>('/permissions').then(r => r.data)
export const getPermissionTree = () => client.get<PermissionTree[]>('/permissions/tree').then(r => r.data)
export const setPermissionOverride = (userId: number, permissionId: number, isGranted: boolean, reason?: string) =>
  client.post('/permissions/overrides', { userId, permissionId, isGranted, reason })
export const removePermissionOverride = (userId: number, permissionId: number) =>
  client.delete(`/permissions/overrides/${userId}/${permissionId}`)
