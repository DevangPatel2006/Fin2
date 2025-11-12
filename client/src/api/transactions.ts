import axios from 'axios';

const API = axios.create({ baseURL: 'https://finlanza-backend1.onrender.com/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const addTransaction = (data: any) => API.post('/transactions/add', data);
export const getUserTransactions = () => API.get('/transactions/my');
