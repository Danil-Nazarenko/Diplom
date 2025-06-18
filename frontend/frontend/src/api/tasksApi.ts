  import api from './axiosConfig';
  import { Task, TaskStatus } from '../types/task';

  export interface CreateTaskPayload {
    title: string;
    description?: string;
    deadline?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'not_started' | 'in_progress' | 'done';
    topicId: number;
  }

  export const createTask = async (task: CreateTaskPayload): Promise<Task> => {
    const response = await api.post('/Tasks', task);
    return response.data as Task;
  };

  export const getTasksByTopicId = async (topicId: number): Promise<Task[]> => {
    const response = await api.get(`/Tasks/${topicId}`);
    return response.data as Task[];
  };

  // Новый метод — обновить всю задачу целиком
  export const updateTask = async (task: Task): Promise<Task> => {
    const response = await api.put(`/Tasks/${task.id}`, task);
    return response.data as Task;
  };

  // Новый метод — частично обновить статус задачи (PATCH)
  export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    const response = await api.patch(`/Tasks/${id}`, { status });
    return response.data as Task;
  };
