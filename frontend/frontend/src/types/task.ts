export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
  subtasks?: Subtask[];
  topicId?: number;
}

export type TaskColumns = {
  [key in TaskStatus]: Task[];
};
