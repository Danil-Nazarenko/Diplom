import { useState } from 'react';
import { Task, TaskStatus, Subtask } from '../types/task';

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Добавить новую задачу
  const addTask = (task: Omit<Task, 'id'>) => {
    const newId = generateId();
    setTasks([...tasks, { ...task, id: newId }]);
  };

  // Обновить задачу
  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, ...updatedFields } : t)));
  };

  // Переместить задачу между статусами
  const moveTaskToStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  // Добавить подзадачу — subtask без id, status и subtasks
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
