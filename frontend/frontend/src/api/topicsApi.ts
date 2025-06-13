import api from './axiosConfig';
import { getUserId } from '../utils/authHelper';

export interface Topic {
  id: number;
  title: string;
  userId?: string;
}

export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get<Topic[]>('/Topics');
  return response.data;
};

export const createTopic = async (title: string): Promise<Topic> => {
  const userId = getUserId(); 
  const response = await api.post<Topic>('/Topics', { title, userId });
  return response.data;
};

export const deleteTopic = async (id: number): Promise<void> => {
  await api.delete(`/Topics/${id}`);
};

export const updateTopic = async (id: number, title: string): Promise<Topic> => {
  const response = await api.put<Topic>(`/Topics/${id}`, { title });
  return response.data;
};
