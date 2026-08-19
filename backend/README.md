# CollabSphere — Backend API

Enterprise real-time collaborative workspace API. Plain JavaScript (CommonJS), Express, MongoDB/Mongoose, Socket.IO.

## Tech Stack

- **Runtime:** Node.js + Express.js (plain JavaScript, no TypeScript)
- **Database:** MongoDB via Mongoose
- **Real-time:** Socket.IO (JWT-authenticated)
- **Auth:** JWT access + refresh tokens (httpOnly cookies), Google OAuth 2.0 Redirect Flow via Passport
- **File uploads:** Multer (local disk storage under `uploads/`)
- **Email:** Nodemailer
- **Jobs:** Lightweight in-memory queues (no Redis/BullMQ) — see `src/jobs/`

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in at minimum:
- `MONGO_URI` — your local or Atlas MongoDB connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` — from Google Cloud Console (OAuth 2.0 credentials, redirect URI must match exactly, e.g. `http://localhost:5000/api/v1/auth/google/callback`)
- `SMTP_*` — for password reset / verification emails (a Gmail app password or any SMTP provider works)

### 3. Start MongoDB
Make sure MongoDB is running locally, e.g.:
```bash
mongod --dbpath /path/to/data
```
Or point `MONGO_URI` at a MongoDB Atlas cluster.

### 4. (Optional) Seed demo data
Creates a demo org, workspace, admin user, sample project/board/task, and a `#general` channel.
```bash
npm run seed
```
Login with `admin@collabsphere.co` / `Password123!` after seeding.

### 5. Run the server
```bash
npm run dev     # nodemon, auto-restart on changes
npm start       # production
```

The API will be available at `http://localhost:5000/api/v1`, with a health check at `/api/v1/health`.

## Project Structure

```
src/
├── config/        # env, db connection, passport strategy, app-wide constants
├── models/        # Mongoose schemas (User, Workspace, Task, Document, Chat, File, ...)
├── controllers/   # Route handlers, one per module
├── routes/        # Express routers, mounted under /api/v1
├── middlewares/   # auth, RBAC, error handling, rate limiting, uploads, audit logging
├── services/      # Business logic reused across controllers (auth, email, search, analytics)
├── sockets/        # Socket.IO handlers (presence, kanban, documents, chat, notifications)
├── validators/    # express-validator rule sets per module
├── utils/         # logger, ApiResponse/ApiError, JWT helpers, seed script
├── jobs/          # In-memory email queue + due-date reminder scheduler
├── app.js         # Express app config (middleware, routes, error handling)
└── server.js      # HTTP server bootstrap, DB connect, Socket.IO init
```

## API Overview

All routes are prefixed with `/api/v1`.

| Module | Base path | Notes |
|---|---|---|
| Auth | `/auth` | signup, login, Google OAuth redirect flow, refresh, logout, password reset |
| Users | `/users` | profile, avatar, password change |
| Organizations | `/organizations` | multi-tenant top-level container |
| Workspaces | `/workspaces` | RBAC-protected, dashboard summary, invites |
| Projects | `/projects` | auto-creates a default Kanban board on creation |
| Boards | `/boards` | columns, full board-with-tasks fetch |
| Tasks | `/tasks` | checklist, comments, move (drag-and-drop), assignees |
| Documents | `/documents` | versioning, restore, collaborators |
| Chats | `/chats` | channels, DMs, message history, threads |
| Files | `/files` | upload, folders, versioning, locking, sharing, storage quota |
| Notifications | `/notifications` | unread count, mark as read |
| Search | `/search` | global search across tasks/documents/files/chats/users |
| Analytics | `/analytics` | productivity score, task trends, team workload |

## Real-time Events (Socket.IO)

Connect with a valid `accessToken` (cookie or `auth: { token }` on the client). Key events:

- `presence:join`, `presence:update` — online/away/offline tracking
- `board:join` / `task:move` / `task:moved` — live Kanban drag-and-drop sync
- `document:join` / `document:change` / `document:changed` / `document:save` — collaborative editing, autosave
- `chat:join` / `message:send` / `message:new` / `message:react` — real-time chat
- `notification:new` — pushed whenever `pushNotification()` is called server-side

## Security Notes

- Passwords hashed with bcrypt (12 rounds)
- Access/refresh tokens are httpOnly cookies; refresh tokens rotate on use and are tracked in the `Session` collection for revocation
- `helmet`, `cors` (credentialed, restricted to `CLIENT_URL`), and `express-rate-limit` are applied globally; auth endpoints have a stricter limiter
- All file uploads are validated by MIME type and size (`MAX_FILE_SIZE_MB`)
- Every workspace-scoped route loads and checks the caller's role via `loadWorkspaceRole` + `requireRole`/`requirePermission`
- Critical actions (deletes, role changes, restores) are written to the `AuditLog` collection via `req.audit(...)`

## Known Trade-offs (vs. the original spec)

Per project requirements, this build intentionally **omits TypeScript, Prisma, PostgreSQL, Redis, and Docker**, using plain JavaScript, Mongoose/MongoDB, and in-memory job queues instead. If you outgrow the in-memory queue (multi-instance deployment), swap `src/jobs/` for BullMQ+Redis or a Mongo-backed scheduler like `agenda` — the call sites (`enqueueEmail`, `pushNotification`) won't need to change.
