import api from './axiosConfig';

export interface Topic {
  id: number;
  title: string;
  userId?: string;
  deadline?: string;
}

export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get<Topic[]>('/Topics');
  return response.data;
};

export const getTopicById = async (id: number): Promise<Topic> => {
  const response = await api.get<Topic>(`/Topics/${id}`);
  return response.data;
};

export const createTopic = async (title: string, deadline?: string): Promise<Topic> => {
  const payload: { title: string; deadline?: string } = { title };
  if (deadline) {
    payload.deadline = deadline;
  }

  console.log('Отправка темы на сервер:', payload);

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

export const updateTopic = async (
  id: number,
  title: string,
  deadline?: string
): Promise<Topic> => {
  const payload: { title: string; deadline?: string } = { title };
  if (deadline) {
    payload.deadline = deadline;
  }
  const response = await api.put<Topic>(`/Topics/${id}`, payload);
  return response.data;
};
