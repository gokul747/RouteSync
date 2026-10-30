import api from './api'
export const getDrivers = () => api.get('/drivers').then(r => r.data)
export const createDriver = data => api.post('/drivers', data).then(r => r.data)
