import { useState } from 'react';
import { Task, TaskStatus, Subtask } from '../types/task';
import { createTask, updateTask as apiUpdateTask, updateTaskStatus } from '../api/tasksApi';

// Тип для создания задачи с обязательным topicId
type CreateTaskPayload = Omit<Task, 'id'> & { topicId: number };

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Создать новую задачу на сервере и добавить в локальный стейт
  const addTask = async (task: CreateTaskPayload) => {
    try {
      const createdTask = await createTask(task);
      setTasks(prev => [...prev, createdTask]);
      return createdTask;
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
      throw error;
    }
  };

  // Обновить задачу полностью на сервере и в локальном состоянии
  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) {
      console.warn('Задача для обновления не найдена', id);
      return;
    }

    const updatedTask = { ...taskToUpdate, ...updatedFields };
    try {
      const serverTask = await apiUpdateTask(updatedTask);
      setTasks(prev => prev.map(t => (t.id === id ? serverTask : t)));
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  // Обновить статус задачи (обертка над updateTask)
  const moveTaskToStatus = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  };

  // Добавление подзадачи локально (позже можно расширить для API)
  const addSubtask = (taskId: string, subtask: Omit<Subtask, 'id'>) => {
    const newSubtask: Subtask = {
      ...subtask,
      id: generateId(),
    };

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks ? [...task.subtasks, newSubtask] : [newSubtask],
            }
          : task
      )
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    moveTaskToStatus,
    addSubtask,
    setTasks,
  };
}
