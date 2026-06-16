import client from './client'
import type { Company } from '../types'

export const getCompanies = () => client.get<Company[]>('/companies').then(r => r.data)
export const createCompany = (data: { name: string; shortName?: string }) => client.post<Company>('/companies', data).then(r => r.data)
export const updateCompany = (id: number, data: Partial<Company>) => client.put(`/companies/${id}`, data)
export const deleteCompany = (id: number) => client.delete(`/companies/${id}`)
