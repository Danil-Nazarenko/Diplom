import axios from 'axios';

export interface Topic {
  id: number;
  title: string;
  userId?: string;
}

const API_BASE_URL = 'http://localhost:5045/api/Topics';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken'); // исправлено: был "token"
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTopics = async (): Promise<Topic[]> => {
  const response = await axios.get<Topic[]>(API_BASE_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createTopic = async (title: string): Promise<Topic> => {
  const userId = localStorage.getItem('userId');
  const response = await axios.post<Topic>(
    API_BASE_URL,
    { title, userId },
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};
