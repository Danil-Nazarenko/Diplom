import axios from 'axios';

// Определяем интерфейс Topic
export interface Topic {
  id: number;
  title: string;
  userId?: string;
}

const API_BASE_URL = 'http://localhost:5045/api/topics';

export const getTopics = async (): Promise<Topic[]> => {
  const response = await axios.get<Topic[]>(API_BASE_URL, { withCredentials: true });
  return response.data;
};

export const createTopic = async (title: string): Promise<Topic> => {
  const response = await axios.post<Topic>(
    API_BASE_URL,
    { title },
    { withCredentials: true }
  );
  return response.data;
};

