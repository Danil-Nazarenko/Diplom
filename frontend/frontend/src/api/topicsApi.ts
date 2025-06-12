import axios from 'axios';
import { getToken, getUserId } from '../utils/authHelper';

export interface Topic {
  id: number;
  title: string;
  userId?: string;
}

const API_BASE_URL = 'http://localhost:5045/api/Topics';

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTopics = async (): Promise<Topic[]> => {
  const response = await axios.get<Topic[]>(API_BASE_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createTopic = async (title: string): Promise<Topic> => {
  const userId = getUserId(); 
  const response = await axios.post<Topic>(
    API_BASE_URL,
    { title, userId },
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

export const deleteTopic = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeader(),
  });
};

export const updateTopic = async (id: number, title: string): Promise<Topic> => {
  const response = await axios.put<Topic>(
    `${API_BASE_URL}/${id}`,
    { title },
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};
