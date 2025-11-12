import axios from 'axios';



const API = axios.create({ baseURL: 'https://finlanza-backend1.onrender.com/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const addGoal = (data: any) => API.post('/goals/add', data);
export const getUserGoals = () => API.get('/goals/my');
export const getGoalById = (id: string) => API.get(`/goals/${id}`);
export const updateGoal = (id: string, data: any) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id: string) => API.delete(`/goals/${id}`);