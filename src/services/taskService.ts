import { CreateTaskInput, Task, TaskStatus, TASK_STATUSES } from '../models/taskModel';
import { TaskRepository } from '../repositories/taskRepository';
import { AppError } from '../utils/appError';

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    const payload = {
      title: input.title.trim(),
      description: input.description.trim()
    };

    return this.repository.createTask(payload);
  }

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async getTask(id: number): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    if (!TASK_STATUSES.includes(status)) {
      throw new AppError('Estado no soportado', 400, { allowed: TASK_STATUSES });
    }

    const task = await this.repository.updateStatus(id, status);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    return task;
  }
}
