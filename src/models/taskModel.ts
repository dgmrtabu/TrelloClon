export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskStatusInput {
  id: number;
  status: TaskStatus;
}

export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];
