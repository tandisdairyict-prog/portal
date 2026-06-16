import client from './client'
import type { Position, PositionTree } from '../types'

export const getPositions = () => client.get<Position[]>('/positions').then(r => r.data)
export const getPositionTree = () => client.get<PositionTree[]>('/positions/tree').then(r => r.data)
export const getPosition = (id: number) => client.get<Position>(`/positions/${id}`).then(r => r.data)
export const createPosition = (data: { departmentId: number; parentPositionId?: number; title: string; description?: string }) =>
  client.post<Position>('/positions', data).then(r => r.data)
export const updatePosition = (id: number, data: Partial<Position>) => client.put(`/positions/${id}`, data)
export const movePosition = (id: number, newParentPositionId: number | null) =>
  client.patch(`/positions/${id}/move`, { newParentPositionId })
export const deletePosition = (id: number) => client.delete(`/positions/${id}`)
