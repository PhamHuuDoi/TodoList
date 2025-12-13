
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';

export const fetchTasks = () => axios.get(API).then(r => r.data);
export const fetchTask = (id) => axios.get(`${API}/${id}`).then(r => r.data);
export const createTask = (data) => axios.post(API, data).then(r => r.data);
export const updateTask = (id, data) => axios.put(`${API}/${id}`, data).then(r => r.data);
export const deleteTask = (id) => axios.delete(`${API}/${id}`).then(r => r.data);

export const getStatsStatus = () => axios.get(`${API}/stats/status`).then(r => r.data);
export const getStatsDaily = (days = 7) => axios.get(`${API}/stats/day?days=${days}`).then(r => r.data);
