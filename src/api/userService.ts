import { User } from '../page/Dashboard/Dashboard';
import apiClient from './apiClient';

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/login', { email, password });
  return response.data;
};

export const getUsers = async (page: number, limit: number) => {
  const response = await apiClient.get('/users', { params: { page, limit } });
  return response.data;
};

export const addUser = async (userData: Partial<User>) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};