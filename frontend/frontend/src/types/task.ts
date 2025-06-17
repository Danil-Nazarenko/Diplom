export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

// Отдельный тип для подзадач — без поля status
export interface Subtask {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
}

// Основной тип задачи — теперь subtasks это массив Subtask
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
  subtasks?: Subtask[];
}

export type TaskColumns = {
  [key in TaskStatus]: Task[];
};
