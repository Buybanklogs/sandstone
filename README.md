# SandStoneFX auth app

This project recreates the uploaded dark login UI as a responsive React frontend and adds a Node.js + Express backend that works with PostgreSQL.

## Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: bcrypt password hashing + JWT response token

## Project structure

```txt
sandstone-auth-app/
  frontend/
  backend/
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend` if needed:

```bash
VITE_API_URL=http://localhost:4000
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` values, then run:

```bash
psql "$DATABASE_URL" -f schema.sql
npm run dev
```

## Railway notes

On Railway, create a PostgreSQL service and a backend service.

Set these environment variables in the backend service:

```bash
DATABASE_URL=your-railway-postgres-url
JWT_SECRET=your-long-random-secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
PORT=4000
```

Deploy the backend, then set the frontend variable:

```bash
VITE_API_URL=https://your-backend-domain.up.railway.app
```

## API

### `POST /api/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

### `POST /api/auth/login`

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

## Notes

- Login returns a JWT token in JSON.
- Registration creates the user record in PostgreSQL.
- Passwords are hashed with bcrypt before storage.
- The UI is responsive and adapts for mobile and desktop.
