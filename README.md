# internflow-ai
AI-powered internship management platform with role-based dashboards, announcements, FAQs, analytics, and an AI assistant built with Next.js.

## Repository Layout

- `src/` — existing Next.js frontend application
- `backend/` — new Express + MongoDB backend implementation
- `frontend/` — new React + Vite standalone frontend scaffold

## Backend

The backend includes:

- `backend/server.js` — Express server entry point
- `backend/models/` — Mongoose schemas for `User`, `Question`, and `Answer`
- `backend/routes/` — route definitions for auth, questions, and answers
- `backend/controllers/` — request handlers for auth, questions, and answers
- `backend/middleware/authMiddleware.js` — JWT authentication middleware
- `backend/.env.example` — environment variable example file

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

The backend exposes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/questions`
- `GET/POST/PUT/DELETE /api/answers`

### AI Assistant

The Next.js app includes an AI assistant at `/dashboard/intern/ai-assistant`.
It uses the local `src/app/api/chat/route.ts` endpoint, which calls OpenAI when `OPENAI_API_KEY` is configured.
If no key is present, the assistant will still respond with a fallback helper message.

## Frontend

The new frontend scaffold includes:

- `frontend/src/App.jsx` — routes and layout
- `frontend/src/pages/` — `Home`, `AskQuestion`, `QuestionDetail`, and `Login`
- `frontend/src/components/` — `Navbar`, `QuestionCard`, and `AnswerBox`
- `frontend/src/styles.css` — basic UI styling

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

This app is a starter layout for issue tracking and Q&A flows. It includes:

- navigation via React Router
- question listing and detail pages
- question submission form
- login page mockup

## Notes

- The new `frontend/` directory is a standalone React/Vite project separate from the existing Next.js app.
- The new `backend/` directory contains a basic API server ready for MongoDB.
- You can connect the frontend to the backend by adding fetch calls to the `/api` routes from the React pages.
