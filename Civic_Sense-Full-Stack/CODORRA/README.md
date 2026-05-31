# Civic Sense — Full Stack

> **Note for Reviewers:** The originally submitted deployment link is currently not working. Please use the following link to access the live application:
> **https://civicsense-rouge-beta.vercel.app/**

A full-stack privacy and civic data management platform. Civic Sense allows citizens to control what government bodies can access from their personal documents and social media accounts. Government bodies can search citizens, view permitted documents, and formally request access to locked content.

---

## What It Does

**For Citizens:**
- Upload and manage personal documents (bank statements, government IDs, etc.)
- Grant or revoke document access to government bodies at any time
- Manage linked social media accounts (activate/deactivate)
- Approve or deny incoming access requests from government bodies
- View a full activity log of who accessed what and when
- Emergency Stop — instantly revokes all access and deactivates all social accounts with one click

**For Government Bodies:**
- Search citizens by name, UID, or city
- View a citizen's accessible documents and social media presence
- Formally request access to locked documents (citizen is notified and must approve)

---

## Project Structure

```text
Civic_Sense-Full-Stack/
└── CODORRA/
    ├── src/                        # Backend source (TypeScript / Express)
    │   ├── index.ts                # Server entry point
    │   ├── app.ts                  # Express app setup (CORS, middleware, routes)
    │   ├── domain.ts               # Core business logic types
    │   ├── routes/                 # API route handlers
    │   ├── services/               # Business logic services
    │   ├── store/                  # In-memory and Supabase data stores
    │   ├── middleware/             # Auth, rate limiting, error handling
    │   ├── config/                 # Environment and app configuration
    │   ├── utils/                  # Encryption and helper utilities
    │   └── types/                  # Shared TypeScript type definitions
    ├── scripts/                    # Test scripts (Bash + PowerShell)
    ├── supabase/                   # Supabase migration files
    ├── tools/                      # Migration runner
    ├── .env.example                # Environment variable template
    ├── package.json
    └── CivicVault-frontend/
        └── civicvault-app/         # Frontend source (React / Vite)
            └── src/
                ├── main.jsx        # React entry point & router configuration
                ├── AuthPage.jsx    # Unified login/signup page with role selection
                ├── App.jsx         # Citizen portal dashboard
                └── GovernmentPortal.jsx  # Government body dashboard
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** Supabase (PostgreSQL) with in-memory fallback for demo mode
- **File Storage:** Supabase Storage (encrypted before upload using AES-256-GCM)
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit, CORS

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** Vanilla CSS with inline styles (DM Sans, custom design system)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A terminal (PowerShell on Windows, Bash on Mac/Linux)

---

## Getting Started

You need to run **two processes** side by side: the backend and the frontend. Open two terminal windows.

### Terminal 1 — Backend

```bash
# Navigate to the backend directory
cd Civic_Sense-Full-Stack/CODORRA

# First-time only: create your environment file
Copy-Item .env.example .env       # Windows (PowerShell)
cp .env.example .env               # Mac / Linux

# Open .env and set at minimum:
# APP_ENCRYPTION_SECRET=<any-random-string>
# Leave ALLOW_DEMO_AUTH=true for local/demo use

# Install dependencies (first time only)
npm install

# Start the backend
npm run dev
```

Backend will be available at: `http://localhost:3001`

Health check: `curl http://localhost:3001/health`

---

### Terminal 2 — Frontend

```bash
# Navigate to the frontend directory
cd Civic_Sense-Full-Stack/CODORRA/CivicVault-frontend/civicvault-app

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Environment Variables

All variables are defined in `CODORRA/.env.example`. Copy it to `.env` before running.

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Backend port. Defaults to `3001`. |
| `CORS_ORIGIN` | No | Allowed frontend origin. Defaults to `http://localhost:3000`. |
| `APP_ENCRYPTION_SECRET` | **Yes** | Secret key for AES-256-GCM file encryption. Change before deploying. |
| `ALLOW_DEMO_AUTH` | No | Set to `true` to enable header-based demo authentication (no Supabase needed). |
| `SUPABASE_URL` | No | Supabase project URL. Required for persistent storage. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key. Required for persistent storage. |
| `SUPABASE_STORAGE_BUCKET` | No | Supabase storage bucket name for evidence files. |

---

## Demo Auth (Hackathon Mode)

When `ALLOW_DEMO_AUTH=true`, you can call backend APIs without Supabase by passing these HTTP headers:

| Header | Description |
|--------|-------------|
| `x-demo-user-id` | Any string user ID |
| `x-demo-user-email` | User email address |
| `x-demo-user-name` | Display name |
| `x-demo-role` | `user` or `admin` |

Example:
```js
fetch('http://localhost:3001/api/assessments/exposure', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-demo-user-id': 'alice',
    'x-demo-user-email': 'alice@example.com',
    'x-demo-user-name': 'Alice',
    'x-demo-role': 'user'
  },
  body: JSON.stringify({ publicInstagram: true })
});
```

---

## Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/emergency/activate` | Activate emergency lockdown for a user |
| `POST` | `/api/assessments/exposure` | Submit an exposure risk assessment |
| `POST` | `/api/assessments/threat` | Submit a threat level assessment |
| `POST` | `/api/assessments/checklist` | Generate a safety action checklist |
| `POST` | `/api/evidence` | Upload an encrypted evidence file |
| `POST` | `/api/admin/requests` | Submit a government access request |
| `PATCH` | `/api/admin/requests/:id` | Approve or deny an access request |
| `GET` | `/api/audit` | Retrieve the audit log |

---

## How Routing Works (Frontend)

The frontend uses React Router. When a user logs in via the Auth Page, they are redirected based on their selected role:

- **Citizen** login redirects to `/vault` which renders `App.jsx`
- **Government Body** login redirects to `/gov` which renders `GovernmentPortal.jsx`
- Unauthenticated users always land on `/` which renders `AuthPage.jsx`

---

## Security Notes

- Evidence files are encrypted using AES-256-GCM before being uploaded to storage.
- Do not enable `ALLOW_DEMO_AUTH=true` in production.
- Rate limiting and Helmet headers are applied to all API routes.
- All access requests and emergency activations are written to an audit log.

---

*Developed for the Codorra / Civic Sense project.*
