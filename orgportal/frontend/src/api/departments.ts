import client from './client'
import type { Department } from '../types'

export const getDepartments = (companyId?: number) =>
  client.get<Department[]>('/departments', { params: companyId ? { companyId } : {} }).then(r => r.data)
export const createDepartment = (data: { companyId: number; parentDepartmentId?: number; name: string; code: string }) =>
  client.post('/departments', data).then(r => r.data)
export const updateDepartment = (id: number, data: Partial<Department>) => client.put(`/departments/${id}`, data)
export const deleteDepartment = (id: number) => client.delete(`/departments/${id}`)
