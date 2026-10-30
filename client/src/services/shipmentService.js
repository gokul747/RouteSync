import api from './api'
export const getShipments = () => api.get('/shipments').then(r => r.data)
export const createShipment = data => api.post('/shipments', data).then(r => r.data)
export const updateShipment = (id, data) => api.patch(`/shipments/${id}`, data).then(r => r.data)
export const getShipmentEvents = id => api.get(`/shipments/${id}/events`).then(r => r.data)
