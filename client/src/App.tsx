import type { FormEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

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

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 5;

const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim();

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [newTask, setNewTask] = useState('');
  const [creating, setCreating] = useState(false);
  const [statusChangingId, setStatusChangingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [savingEditId, setSavingEditId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const pendingTasks = useMemo(() => tasks.filter((task) => task.status !== 'completed').length, [tasks]);

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
    void loadTasks();
  }, []);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = normalizeText(newTask);
    if (cleaned.length < MIN_DESCRIPTION_LENGTH) {
      showBanner('error', 'Escribe al menos 5 caracteres para crear una tarea');
      return;
    }

    setCreating(true);
    try {
      const response = await apiRequest<{ data: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: cleaned,
          description: cleaned
        })
      });

      setTasks((prev) => [response.data, ...prev]);
      setNewTask('');
      showBanner('success', 'Tarea creada');
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible crear la tarea');
    } finally {
      setCreating(false);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    setStatusChangingId(task.id);
    try {
      const response = await apiRequest<{ data: Task }>(`/tasks/${task.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      setTasks((prev) => prev.map((item) => (item.id === task.id ? response.data : item)));
      showBanner('success', 'Estado actualizado');
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible actualizar la tarea');
    } finally {
      setStatusChangingId(null);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingValue(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const saveEditingTask = async () => {
    if (editingId === null) {
      return;
    }

    const trimmed = normalizeText(editingValue);
    if (trimmed.length < MIN_TITLE_LENGTH) {
      showBanner('error', 'El titulo debe tener al menos 3 caracteres');
      return;
    }

    if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
      showBanner('error', 'El texto debe tener al menos 5 caracteres');
      return;
    }

    const currentTask = tasks.find((task) => task.id === editingId);
    if (!currentTask) {
      cancelEditing();
      return;
    }

    if (currentTask.title === trimmed && currentTask.description === trimmed) {
      cancelEditing();
      return;
    }

    setSavingEditId(editingId);
    try {
      const response = await apiRequest<{ data: Task }>(`/tasks/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: trimmed, description: trimmed })
      });
      setTasks((prev) => prev.map((task) => (task.id === editingId ? response.data : task)));
      showBanner('success', 'Tarea actualizada');
      cancelEditing();
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible editar la tarea');
    } finally {
      setSavingEditId(null);
    }
  };

  const handleEditBlur = () => {
    if (editingId !== null && savingEditId === null) {
      void saveEditingTask();
    }
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void saveEditingTask();
    }

    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const deleteTask = async (taskId: number) => {
    const confirmDelete = window.confirm('¿Eliminar esta tarea?');
    if (!confirmDelete) {
      return;
    }

    setDeletingId(taskId);
    try {
      await apiRequest(`/tasks/${taskId}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      showBanner('success', 'Tarea eliminada');
    } catch (error) {
      showBanner('error', error instanceof Error ? error.message : 'No fue posible eliminar la tarea');
    } finally {
      setDeletingId(null);
    }
  };

  const hasTasks = tasks.length > 0;

  return (
    <div className="task-app">
      <header className="task-header">
        <div>
          <p className="eyebrow">DevPro Bolivia</p>
          <h1>Lista de tareas</h1>
          <p className="subtitle">Agrega, marca como completadas, edita o elimina tus pendientes.</p>
        </div>
        <div className="counter-grid" aria-live="polite">
          <div className="counter-card">
            <p className="counter-label">N° Tareas</p>
            <p className="counter-value">{tasks.length}</p>
          </div>
          <div className="counter-card">
            <p className="counter-label">Pendientes</p>
            <p className="counter-value">{pendingTasks}</p>
          </div>
        </div>
      </header>

      {banner && (
        <div className={`banner banner-${banner.type}`}>
          <span>{banner.message}</span>
          <button type="button" onClick={() => setBanner(null)} aria-label="Cerrar alerta">
            ×
          </button>
        </div>
      )}

      <section className="task-form">
        <form onSubmit={handleCreateTask}>
          <label className="sr-only" htmlFor="new-task">
            ¿Qué hay que hacer?
          </label>
          <input
            id="new-task"
            type="text"
            placeholder="¿Qué hay que hacer?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            maxLength={200}
            disabled={creating}
          />
          <button type="submit" disabled={creating}>
            {creating ? 'Agregando…' : 'Agregar'}
          </button>
        </form>
      </section>

      <section className="task-list">
        {loading ? (
          <p className="empty-state">Cargando tareas…</p>
        ) : !hasTasks ? (
          <p className="empty-state">Sin tareas. ¡Agrega la primera!</p>
        ) : (
          <ul>
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const isEditing = editingId === task.id;
              return (
                <li key={task.id} className={`task-item ${isCompleted ? 'is-done' : ''}`}>
                  <button
                    type="button"
                    className={`status-toggle ${isCompleted ? 'is-completed' : ''}`}
                    onClick={() => toggleTaskStatus(task)}
                    disabled={statusChangingId === task.id || savingEditId !== null}
                    aria-label={`Cambiar estado de ${task.title}`}
                  >
                    <span />
                  </button>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      onBlur={handleEditBlur}
                      onKeyDown={handleEditKeyDown}
                      disabled={savingEditId === task.id}
                      autoFocus
                    />
                  ) : (
                    <p className="task-text">{task.title}</p>
                  )}
                  <div className="task-actions">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => startEditing(task)}
                      disabled={isEditing || deletingId === task.id}
                      aria-label={`Editar tarea ${task.title}`}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => deleteTask(task.id)}
                      disabled={deletingId === task.id || isEditing}
                      aria-label={`Eliminar tarea ${task.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
