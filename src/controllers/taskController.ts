import { Request, Response, NextFunction } from 'express';

import { TaskService } from '../services/taskService';
import { AppError } from '../utils/appError';

const service = new TaskService();

const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    throw new AppError('Id invalido', 400);
  }
  return id;
};

export class TaskController {
  static createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await service.createTask(req.body);
      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  };

  static listTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await service.listTasks();
      res.json({ data: tasks });
    } catch (error) {
      next(error);
    }
  };

  static getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      const task = await service.getTask(id);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      const { status } = req.body;
      const task = await service.updateTaskStatus(id, status);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  };
}
