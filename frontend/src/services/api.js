import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Personnel API
export const personnelAPI = {
  getAll: () => api.get('/personnel'),
  getById: (id) => api.get(`/personnel/${id}`),
  create: (data) => api.post('/personnel', data),
  update: (id, data) => api.put(`/personnel/${id}`, data),
  delete: (id) => api.delete(`/personnel/${id}`),
};

// Sensors API
export const sensorsAPI = {
  getAll: () => api.get('/sensors'),
  getById: (id) => api.get(`/sensors/${id}`),
  getBySerial: (serialNumber) => api.get(`/sensors/serial/${serialNumber}`),
  getLastCalibration: (id) => api.get(`/sensors/${id}/last-calibration`),
  create: (data) => api.post('/sensors', data),
  update: (id, data) => api.put(`/sensors/${id}`, data),
  delete: (id) => api.delete(`/sensors/${id}`),
};

// Equipment API
export const equipmentAPI = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  getBatch: (ids) => api.post('/equipment/batch', { ids }),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
};

export default api;
