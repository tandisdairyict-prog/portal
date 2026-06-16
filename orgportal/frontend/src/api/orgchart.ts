import client from './client'
export const getOrgChart = () => client.get('/orgchart').then(r => r.data)
