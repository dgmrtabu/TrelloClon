Contexto
La empresa de desarrollo de software DevPro Bolivia necesita urgentemente
modernizar su gestión interna de proyectos. Actualmente, la asignación y el
seguimiento de tareas se realizan de manera informal, generando cuellos de botella y
falta de trazabilidad.
Requerimientos Funcionales del MVP (funcionalidades esenciales):
El sistema debe ser un gestor de tareas simple que permita a un usuario:
1. Crear una nueva tarea (título, descripción, estado inicial: pendiente).
2. Ver una lista de todas las tareas.
3. Actualizar el estado de una tarea (ej: a "en progreso" o "completada").
Requerimientos No-Funcionales y técnicos:
El desarrollo, asistido por IA, debe reflejar el uso de algunos de los siguientes
conceptos en el código final y las especificaciones:
● Lenguaje: TypeScript (JavaScript Next-Gen).
● Asincronía: Implementación del backend utilizando Promises y Async/Await.
● API: Diseño REST para las operaciones CRUD (API Strategy).
● Arquitectura: Adhesión a un patrón de diseño simple (ej. MVC) y el principio de
Single Responsibility (SOLID).
● Datos: Definición de una arquitectura de datos simple usando un motor SQL o
NoSQL (a elección) (Database Design).
● Seguridad: Incluir placeholders para Autenticación/Autorización y aplicar Buenas
Prácticas en el manejo de entradas (Cybersecurity Essentials).


Requerimientos funcionales
Crear una nueva tarea
Descripción: Permitir al usuario ingresar una tarea mediante un campo de texto y un botón “Agregar”.
Entradas:
Texto (título de la tarea).
Procesos:
● El usuario escribe la tarea en el campo “¿Qué hay que hacer?”.
● Presiona el botón “Agregar”.
● El sistema valida que el campo no esté vacío.
    {
    id: uuid(),
    titulo: string,
    estado: 'pendiente'
    }
● Añade la tarea al arreglo global de tareas.
● Actualiza los contadores (N° Tareas y Pendientes).
● Limpia el campo de texto.
● Salids: Nueva tarea visible en la lista.
● Prioridad: Alta.

Visualizar la lista de tareas
Descripción: Mostrar todas las tareas existentes con sus estados e íconos de acción.
Entradas: Ninguna (carga automática desde el estado global o localStorage).
Procesos:
● Renderizar un listado con cada tarea en un <li>.
● Mostrar íconos de Editar (✏️) y Eliminar (🗑️).
● Mostrar un indicador de estado (círculo vacío o lleno).
● Calcular dinámicamente el número total y las tareas pendientes.
Salidas:
● Lista interactiva de tareas.
● Contadores actualizados en la cabecera.
Prioridad: Alta.

Actualizar el estado de una tarea
Descripción: Permitir al usuario cambiar el estado de una tarea haciendo clic en el círculo indicador.
Entradas: Evento de clic sobre el círculo de estado.
Procesos:
Al hacer clic, el sistema cambia el valor de estado:
● Si está en “pendiente” → “completada”. 
● (Opcional) Si está en “completada” → “pendiente”.
El texto de la tarea se muestra tachado o con un color diferente.
Se actualizan los contadores en tiempo real.
Salidas: Tarea actualizada visualmente.
Prioridad: Alta.

Editar una tarea
Descripción: Permitir modificar el texto de una tarea existente.
Entradas: Clic en el botón.
Procesos:
Al presionar editar, el texto se convierte en un campo editable.
Al confirmar (Enter o blur), se guarda el nuevo texto en el estado.
Se actualiza el renderizado del componente.
Salidas: Texto de tarea actualizado.
Prioridad: Media.

Eliminar una tarea

Descripción: Permitir eliminar tareas de la lista.
Entradas: Clic en el botón 🗑️.
Procesos:
Al presionar el botón, el sistema muestra una confirmación (opcional).
Si se confirma, elimina la tarea del arreglo.
Se actualizan los contadores y la lista.
Salidas: Lista sin la tarea eliminada.
Prioridad: Alta.
Todo esto referido a:

Diseño de interfaz (resumen visual)
Componentes principales:
Header:
Título: “Lista de Tareas”.
Contadores dinámicos: “N° Tareas” y “Pendientes”.
Formulario de entrada:
Input text: “¿Qué hay que hacer?”.
Botón: “Agregar”.
Lista de tareas:
Checkbox o círculo de estado.
Texto de tarea.
Botones de acción (Editar / Eliminar).