import api from './api'
export const getVehicles = () => api.get('/vehicles').then(r => r.data)
export const createVehicle = data => api.post('/vehicles', data).then(r => r.data)
