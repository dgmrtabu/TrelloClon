import { getDb } from '../db/connection';
import { CreateTaskInput, Task, TaskStatus } from '../models/taskModel';

const mapRowToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status as TaskStatus,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export class TaskRepository {
  async createTask(input: CreateTaskInput): Promise<Task> {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO tasks (title, description, status, created_at, updated_at)
       VALUES (?, ?, 'pending', ?, ?);`,
      input.title,
      input.description,
      timestamp,
      timestamp
    );

    const created = await db.get(`SELECT * FROM tasks WHERE id = ?`, result.lastID);
    if (!created) {
      throw new Error('No se pudo recuperar la tarea creada');
    }
    return mapRowToTask(created);
  }

  async findAll(): Promise<Task[]> {
    const db = await getDb();
    const rows = await db.all(`SELECT * FROM tasks ORDER BY created_at DESC;`);
    return rows.map(mapRowToTask);
  }

  async findById(id: number): Promise<Task | null> {
    const db = await getDb();
    const row = await db.get(`SELECT * FROM tasks WHERE id = ?;`, id);
    return row ? mapRowToTask(row) : null;
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const db = await getDb();
    const updatedAt = new Date().toISOString();

    const result = await db.run(
      `UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?;`,
      status,
      updatedAt,
      id
    );

    if (result.changes === 0) {
      return null;
    }

    const updated = await db.get(`SELECT * FROM tasks WHERE id = ?;`, id);
    if (!updated) {
      return null;
    }
    return mapRowToTask(updated);
  }
}
