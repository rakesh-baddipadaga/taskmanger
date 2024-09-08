import axios from 'axios';

const API_URL = 'https://taskmanger-psi.vercel.app//api';

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/`, data);
export const fetchTasks = (token) => axios.get(`${API_URL}/tasks`, { headers: { Authorization: token } });
export const createTask = (data, token) => axios.post(`${API_URL}/tasks`, data, { headers: { Authorization: token } });
export const updateTask = (id, data, token) => axios.put(`${API_URL}/tasks/${id}`, data, { headers: { Authorization: token } });
export const deleteTask = (id, token) => axios.delete(`${API_URL}/tasks/${id}`, { headers: { Authorization: token } });
