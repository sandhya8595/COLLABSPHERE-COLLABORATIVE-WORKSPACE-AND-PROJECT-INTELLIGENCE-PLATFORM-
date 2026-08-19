# CollabSphere — Frontend

Enterprise collaborative workspace UI. React + JSX (no TypeScript), Vite, Tailwind CSS, Redux Toolkit, Socket.IO client.

## Tech Stack

- **Build tool:** Vite
- **UI:** React 18 (JSX), Tailwind CSS
- **State:** Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)
- **Data fetching:** Axios (with automatic access-token refresh interceptor) + TanStack Query (available for future use)
- **Real-time:** `socket.io-client`, shared via a React Context (`SocketProvider`)
- **Forms:** react-hook-form
- **Drag-and-drop:** react-dnd (Kanban board)
- **Charts:** Recharts (Analytics page)
- **Routing:** react-router-dom v6, with route-level code splitting (`React.lazy`)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Defaults assume the backend runs on `http://localhost:5000`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run the dev server
```bash
npm run dev
```
The app runs at `http://localhost:5173`. The Vite dev server proxies `/api` and `/uploads` to the backend, so cookies and relative paths work the same as in production.

### 4. Build for production
```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, Sidebar, Modal, Avatar, Dropdown, ProtectedRoute, Loader
│   ├── auth/          # Login/Signup forms, Google OAuth button
│   ├── dashboard/     # Stats cards, active projects, recent documents, activity feed
│   ├── kanban/        # KanbanBoard, KanbanColumn, TaskCard, TaskModal (drag-and-drop)
│   ├── chat/          # ChatSidebar, ChatWindow, MessageBubble, ThreadPanel, MessageInput
│   ├── documents/     # DocumentEditor (collaborative), Outline, Comments, VersionHistory
│   ├── files/         # FileExplorer, FileList, FileDetailsPanel, UploadDropzone
│   ├── analytics/     # Charts and summary cards
│   └── settings/      # Profile, Workspace brand, Team members, Permissions, Security, Billing
├── pages/             # One component per route
├── layouts/           # AuthLayout (split-screen), MainLayout (sidebar + navbar shell)
├── routes/            # AppRoutes.jsx — lazy-loaded route definitions
├── store/             # Redux slices: auth, workspace, task, chat, notification
├── context/           # SocketContext (Socket.IO), ThemeContext (light/dark)
├── hooks/              # useAuth, useSocket, useDebounce, useOutsideClick
├── services/           # Axios-based API clients, one per backend module
├── utils/              # date formatting, validators, shared constants
├── App.jsx
├── main.jsx
└── index.css
```

## How Real-time Features Work

`SocketProvider` (in `src/context/SocketContext.jsx`) opens a single authenticated Socket.IO connection once the user is logged in, and exposes it via `useSocket()`. Feature pages/components subscribe to the events they care about and clean up listeners on unmount:

- **Kanban** (`KanbanBoard.jsx`): joins `board:<id>`, emits `task:move` on drag-and-drop, listens for `task:moved` from other clients and applies it optimistically via the `task` Redux slice.
- **Documents** (`DocumentEditor.jsx`): a lightweight `contentEditable`-based editor that broadcasts `document:change` on input, listens for `document:changed` from collaborators, shows live "X is editing..." indicators, and autosaves via `document:save` 1.5s after the last keystroke. This is an MVP collaborative editor — for true operational-transform/CRDT conflict resolution at scale, swap the `contentEditable` div for TipTap bound to a Yjs document; the socket event contract stays the same.
- **Chat** (`ChatPage.jsx`): joins/leaves chat rooms, sends/receives messages, reactions, and typing indicators in real time.
- **Notifications**: any `pushNotification()` call on the backend arrives instantly via the `notification:new` event and updates the unread badge in the navbar.

## Auth Flow

- Email/password and Google OAuth (redirect flow — `GoogleLoginButton` sends the browser to `${API}/auth/google`, backend handles the callback and redirects to `/auth/callback` on the frontend, which fetches the current user and routes into the app).
- Access/refresh tokens live in httpOnly cookies; the Axios interceptor in `services/api.js` automatically calls `/auth/refresh` on a 401 and retries the original request once.
- `ProtectedRoute` guards all authenticated routes and redirects to `/login` if the session can't be restored.

## Known Trade-offs (vs. the original spec)

Per project requirements, this build intentionally **omits TypeScript**, using plain `.jsx` files throughout. It also skips Redux `RTK Query`/Zod runtime validation in favor of a simpler Axios service layer — both can be layered in later without restructuring the app.
