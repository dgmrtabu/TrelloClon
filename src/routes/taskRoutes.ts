import { Router } from 'express';
import { body, param } from 'express-validator';

import { TaskController } from '../controllers/taskController';
import { TASK_STATUSES } from '../models/taskModel';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

const idParam = param('id').isInt({ gt: 0 }).withMessage('Id invalido');

router.post(
  '/',
  [
    body('title').isString().trim().isLength({ min: 3 }).withMessage('El titulo debe tener al menos 3 caracteres'),
    body('description').isString().trim().isLength({ min: 5 }).withMessage('La descripcion debe tener al menos 5 caracteres')
  ],
  validateRequest,
  TaskController.createTask
);

router.get('/', TaskController.listTasks);

router.get(
  '/:id',
  [idParam],
  validateRequest,
  TaskController.getTask
);

router.patch(
  '/:id/status',
  [
    idParam,
    body('status').isString().isIn(TASK_STATUSES).withMessage(`Estado invalido. Valores permitidos: ${TASK_STATUSES.join(', ')}`)
  ],
  validateRequest,
  TaskController.updateStatus
);

router.patch(
  '/:id',
  [
    idParam,
    body().custom((_value, { req }) => {
      if (!req.body.title && !req.body.description) {
        throw new Error('Debe proporcionar titulo o descripcion');
      }
      return true;
    }),
    body('title').optional().isString().trim().isLength({ min: 3 }).withMessage('El titulo debe tener al menos 3 caracteres'),
    body('description').optional().isString().trim().isLength({ min: 5 }).withMessage('La descripcion debe tener al menos 5 caracteres')
  ],
  validateRequest,
  TaskController.updateTask
);

router.delete(
  '/:id',
  [idParam],
  validateRequest,
  TaskController.deleteTask
);

export default router;
