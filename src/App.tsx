import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import './App.css';
import { apiRequest } from './lib/api';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

interface Banner {
  type: 'success' | 'error';
  message: string;
}

const STATUS_COLUMNS: Array<{
  id: TaskStatus;
  label: string;
  helper: string;
}> = [
  { id: 'pending', label: 'Pendiente', helper: 'Ideas y trabajo por iniciar' },
  { id: 'in_progress', label: 'En progreso', helper: 'Tareas activas' },
  { id: 'completed', label: 'Completada', helper: 'Listas para entregar' }
];

const INITIAL_FORM = { title: '', description: '' };

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTask, setActiveTask] = useState<number | null>(null);

  const groupedTasks = useMemo(() => {
    return STATUS_COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const focusInput =
    (name: keyof typeof INITIAL_FORM) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [name]: event.target.value }));
    };

  const showBanner = (type: Banner['type'], message: string) => {
    setBanner({ type, message });
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: Task[] }>('/tasks');
      setTasks(response.data ?? []);
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showBanner('error', 'Completa titulo y descripcion');
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiRequest<{ data: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim()
        })
      });

      setTasks((prev) => [response.data, ...prev]);
      setForm(INITIAL_FORM);
      showBanner('success', 'Tarea creada');
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible crear la tarea');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (taskId: number, nextStatus: TaskStatus) => {
    setActiveTask(taskId);
    try {
      const response = await apiRequest<{ data: Task }>(/tasks//status, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });

      setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task)));
      showBanner('success', 'Estado actualizado');
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible actualizar el estado');
    } finally {
      setActiveTask(null);
    }
  };

  const hasTasks = tasks.length > 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">DevPro Bolivia</p>
          <h1>Tablero de tareas</h1>
          <p className="subtitle">Clone ligero de Trello conectado al backend Express.</p>
        </div>
        <div className="header-actions">
          <button className="outline" onClick={loadTasks} disabled={loading}>
            {loading ? 'Actualizando...' : 'Refrescar'}
          </button>
        </div>
      </header>

      {banner && (
        <div className={anner banner-}>
          <span>{banner.message}</span>
          <button onClick={() => setBanner(null)} aria-label="Cerrar alerta">
            &times;
          </button>
        </div>
      )}

      <section className="create-panel">
        <form onSubmit={handleCreateTask}>
          <div className="form-row">
            <label>
              Titulo
              <input
                type="text"
                placeholder="Ej. Configurar CI"
                value={form.title}
                onChange={focusInput('title')}
                maxLength={120}
              />
            </label>
            <label>
              Descripcion
              <textarea
                placeholder="Detalle la tarea para el equipo"
                value={form.description}
                onChange={focusInput('description')}
                maxLength={500}
                rows={3}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </section>

      <section className="board-grid">
        {STATUS_COLUMNS.map((column) => {
          const columnTasks = groupedTasks[column.id] ?? [];
          return (
            <article key={column.id} className="board-column">
              <header>
                <div>
                  <p className="eyebrow">{column.label}</p>
                  <h2>{columnTasks.length} tareas</h2>
                </div>
                <p className="helper">{column.helper}</p>
              </header>

              {loading && !hasTasks ? (
                <p className="empty">Cargando tareas...</p>
              ) : columnTasks.length === 0 ? (
                <p className="empty">Nada por aqui</p>
              ) : (
                <ul>
                  {columnTasks.map((task) => (
                    <li key={task.id} className="task-card">
                      <div className="task-meta">
                        <p className="task-title">{task.title}</p>
                        <p className="task-description">{task.description}</p>
                      </div>
                      <div className="task-footer">
                        <small>#{task.id}</small>
                        <select
                          value={task.status}
                          onChange={(event) => handleStatusChange(task.id, event.target.value as TaskStatus)}
                          disabled={activeTask === task.id}
                        >
                          {STATUS_COLUMNS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default App;
