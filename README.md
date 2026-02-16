# Agency CRM (Next.js + TypeScript)

Production-style CRM web app for a small-business web design agency.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + custom shadcn-style component primitives
- Recharts
- React Hook Form + Zod
- TanStack Table
- Zustand
- date-fns
- Lucide icons
- Framer Motion

## Routes

- `/dashboard`
- `/leads`
- `/leads/[id]`
- `/clients`
- `/clients/[id]`
- `/projects`
- `/calendar`
- `/tasks`
- `/settings`

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Login

This app uses simple env-based login credentials with a session cookie.

Set in `.env.local`:

```bash
AUTH_EMAIL=you@example.com
AUTH_PASSWORD=your-password
AUTH_SESSION_TOKEN=your-long-random-token
```

Then sign in at `/login`.

## Build Checks

```bash
npm run typecheck
npm run build
```

## Data Layer

- Mock seed data lives in `/Users/kylecoffelt/Downloads/HometownDashboard/lib/mock-data.ts`.
- In-memory app state + CRUD actions live in `/Users/kylecoffelt/Downloads/HometownDashboard/lib/store.ts`.
- API adapter surface for future persistence lives in `/Users/kylecoffelt/Downloads/HometownDashboard/lib/mock-api.ts`.

To switch to Prisma/Postgres later:
1. Keep current UI/forms/routes unchanged.
2. Replace `lib/mock-api.ts` internals with real DB calls.
3. Move optimistic updates from store actions to mutation handlers as needed.

## Design + UX Notes

- Responsive app shell with desktop sidebar, mobile drawer, and bottom nav.
- Global search + quick add lead in topbar.
- Dark mode via `next-themes`.
- Empty states, skeletons, status badges, and subtle motion with reduced-motion support.
- Accessible labels, semantic layout, keyboard-safe dialogs.
