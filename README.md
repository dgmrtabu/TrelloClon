# TrelloClon DevPro Bolivia

Gestor de tareas estilo Trello construido con TypeScript. Incluye backend Express + SQLite y un frontend React (Vite) que consume las APIs REST para crear, listar, editar, completar y eliminar tareas con contadores dinámicos.

## Caracteristicas clave
- **Stack TypeScript**: backend y frontend escritos en TS moderno.
- **Asincronia**: repositorio SQLite implementado con Promises/async-await.
- **API REST**: rutas versionadas bajo `/api/v1/tasks` para CRUD esencial.
- **Arquitectura**: capas separadas (routing -> controller -> service -> repository) respetando SRP.
- **Seguridad**: middleware `authPlaceholder` y validaciones de entrada (`express-validator`).
- **Frontend React**: lista interactiva con contadores, formulario rápido, toggles de estado, edición inline y acciones de eliminación.

## Monorepo
```
src/                      # Backend Express
client/                   # Frontend Vite + React
  src/lib/api.ts          # Cliente HTTP contra el backend
  src/App.tsx             # UI principal estilo lista tachable
  src/App.css             # Estilos de la lista y layout
data/                     # SQLite (se crea en runtime)
dist/                     # Salida compilada del backend
README.md
```

## API REST (backend)
Base URL: `http://localhost:4000/api/v1/tasks`

| Metodo | Ruta          | Descripcion                                                   |
| ------ | ------------- | ------------------------------------------------------------- |
| POST   | `/`           | Crea una tarea (estado inicial `pending`)                     |
| GET    | `/`           | Lista todas las tareas                                        |
| GET    | `/:id`        | Obtiene una tarea especifica                                  |
| PATCH  | `/:id`        | Edita titulo y/o descripcion de una tarea                     |
| PATCH  | `/:id/status` | Cambia el estado (`pending`,`in_progress`,`completed`)        |
| DELETE | `/:id`        | Elimina una tarea                                             |

### Ejemplo: crear tarea
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Disenar UI","description":"Pantalla principal"}'
```

### Ejemplo: actualizar estado
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

### Ejemplo: editar titulo
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo titulo","description":"Nuevo titulo"}'
```

### Ejemplo: eliminar tarea
```bash
curl -X DELETE http://localhost:4000/api/v1/tasks/1
```

## Puesta en marcha
### Backend
1. Copiar `.env.example` -> `.env` (opcionalmente ajustar `PORT` o `API_VERSION`).
2. Instalar dependencias: `npm install`.
3. Desarrollo: `npm run dev`.
4. Compilacion: `npm run build`.
5. Produccion local: `npm run start` (usa `dist/`).

La base SQLite se crea automaticamente en `data/<entorno>-trello.db`.

### Frontend
1. Copiar `client/.env.example` -> `client/.env` (definir `VITE_API_BASE_URL`, por defecto `http://localhost:4000/api/v1`).
2. Instalar dependencias: `npm install --prefix client`.
3. Desarrollo: `npm run client:dev` (Vite corre en `http://localhost:5173`).
4. Compilar: `npm run client:build`.
5. Preview build: `npm run client:preview`.

> Asegurate de tener el backend corriendo para que la UI pueda consumir las APIs.

## Frontend en accion
- Cabecera con contadores en vivo de `N° Tareas` y `Pendientes`.
- Formulario de una sola linea (“¿Qué hay que hacer?”) para registrar tareas rápidamente.
- Lista interactiva con círculos de estado (pendiente/completada), texto editable y botones ✏️/🗑️.
- Validaciones de entrada, feedback visual y confirmación antes de eliminar tareas.

## Futuras mejoras sugeridas
1. Reemplazar `authPlaceholder` por autenticacion real (JWT/OAuth) y autorizacion basada en roles.
2. Agregar columnas configurables por usuario y soporte para multiples tableros.
3. Anadir pruebas automatizadas (unitarias e integracion) y pipeline CI/CD.
4. Implementar drag & drop en el frontend para mover tarjetas visualmente.
