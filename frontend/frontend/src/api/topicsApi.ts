import api from './axiosConfig';

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
  const payload = { title }; // удалили userId
  console.log('Отправка темы на сервер:', payload); // отладочный лог

  try {
    const response = await api.post<Topic>('/Topics', payload);
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при создании темы:', error);
    throw error;
  }
};

export const deleteTopic = async (id: number): Promise<void> => {
  await api.delete(`/Topics/${id}`);
};

export const updateTopic = async (id: number, title: string): Promise<Topic> => {
  const response = await api.put<Topic>(`/Topics/${id}`, { title });
  return response.data;
};
