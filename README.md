# Biblioteca — Frontend

Frontend del sistema de gestión de biblioteca: CRUD de libros, gestión de préstamos y un dashboard de estadísticas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (componentes accesibles sobre Base UI)
- [TanStack Query](https://tanstack.com/query) para el manejo de datos remotos (cache, loading/error states, invalidación)
- react-hook-form + zod para formularios y validación
- recharts para los gráficos del dashboard

## Requisitos previos

- Node.js 20+
- El backend (`biblioteca-backend`) corriendo localmente — ver su propio README.

## Instalación

```bash
npm install
```

Copia el archivo de variables de entorno de ejemplo y ajusta si tu backend corre en otro puerto:

```bash
cp .env.local.example .env.local
```

Por defecto apunta a `http://localhost:4000/api/v1`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Corre ESLint |

## Estructura del proyecto

```
src/
├── app/                   # Rutas (App Router): /, /libros, /prestamos, /estadisticas
├── components/
│   ├── ui/                # Componentes base de shadcn/ui
│   ├── books/ loans/ stats/ layout/ providers/
├── hooks/                 # Hooks de TanStack Query por entidad
├── lib/
│   ├── api/                # Cliente HTTP + funciones por entidad (books, loans, users, stats)
│   └── schemas/            # Validación de formularios (zod)
└── types/                  # Tipos compartidos (Book, Loan, User, ...)
```

## Funcionalidades

- **Libros** (`/libros`): listado con filtros (búsqueda, género, disponibilidad), crear, editar, eliminar.
- **Préstamos** (`/prestamos`): listado con filtro por estado (activo/vencido/devuelto), registrar préstamo (con creación rápida de usuario), marcar como devuelto.
- **Estadísticas** (`/estadisticas`): préstamos activos/vencidos/devueltos, duración promedio de préstamo, libros más prestados, disponibilidad por género.

Todas las mutaciones manejan errores de la API (incluyendo los códigos 409 de reglas de negocio, como "máximo de préstamos activos" o "libro no disponible") mostrando el mensaje correspondiente con notificaciones (toast).
