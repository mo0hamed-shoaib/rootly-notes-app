<p align="center">
  <img alt="Rootly Notes - Your learning journey tracker" src="public/rootly-banner.png" width="1200" />
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Shadcn UI" src="https://img.shields.io/badge/Shadcn%20UI-161618?style=for-the-badge&logo=shadcnui&logoColor=white" />
</p>

<p align="center">
  <img alt="Node 18.18+" src="https://img.shields.io/badge/Node-18.18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="pnpm 9+" src="https://img.shields.io/badge/pnpm-9%2B-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
  <a href="https://vercel.com/new" target="_blank"><img alt="Deploy" src="https://img.shields.io/badge/Deploy%20-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

<p align="center">
  <a href="https://rootly-notes.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20ROOTLY-389bbe?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
</p>

---

## Overview

Rootly Notes is a multi-tenant learning tracker that helps you capture knowledge, organize courses, and track your progress. Features OAuth authentication, per-user data isolation with Supabase Row Level Security, and a clean responsive interface for managing Q&A notes, daily study logs, and practice reviews.

---

## ✨ Features

- **Public Landing Page** – SaaS-style hero with features, FAQ, and subtle geometric background
- **OAuth Authentication** – Sign in with Google or GitHub via Supabase
- **Protected Routes** – All app routes secured with middleware; redirects to login if unauthenticated
- **Dashboard** – Visual charts for understanding levels, study time, mood, and course progress (last 30 days)
- **Notes Management** – Create Q&A notes with code snippets, filter by course/understanding, flag important items, export to JSON/CSV
- **Course Tracking** – Organize courses with instructors, links, and topics; view note counts per course
- **Daily Logging** – Track study time and mood with optional notes
- **Practice Mode** – Quiz yourself with shuffled questions, filter by course or understanding level
- **Responsive Design** – Mobile-friendly with drawer navigation, dark/light theme, and accent color customization

## 🧭 Routes

| Path | Description |
|------|-------------|
| `/` | Public landing page |
| `/login` | Sign-in with Google/GitHub |
| `/auth/callback` | Supabase OAuth callback (server) |
| `/dashboard` | Authenticated overview with charts |
| `/notes` | Notes grid, filters, export |
| `/courses` | Course management |
| `/daily` | Daily study and mood tracking |
| `/review` | Practice session |
| `/about`, `/how-it-works` | Informational pages |

---

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, TypeScript, Tailwind CSS v4
- **Components:** Radix UI primitives, shadcn-inspired design system
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL, Authentication, Row Level Security)
- **Icons:** Lucide React
- **Fonts:** Geist Sans/Mono
- **Theming:** next-themes for dark/light mode

---

 

## 📦 Data Model

Multi-tenant schema with per-user isolation:

- `profiles`
  - `id` UUID (PK) → matches auth user id
  - `full_name` text, `avatar_url` text
  - `created_at`, `updated_at`

- `courses`
  - `id` UUID (PK)
  - `user_id` UUID → `profiles.id`
  - `instructor` text, `title` text
  - `links` text[], `topics` text[]
  - `created_at`, `updated_at`

- `notes`
  - `id` UUID (PK)
  - `user_id` UUID → `profiles.id`
  - `course_id` UUID → `courses.id`
  - `question` text, `answer` text
  - `code_snippet` text, `code_language` text
  - `understanding_level` int (1–5), `flag` boolean
  - `created_at`, `updated_at`

- `daily_entries`
  - `id` UUID (PK)
  - `user_id` UUID → `profiles.id`
  - `date` date (unique per user per day)
  - `study_time` int, `mood` int (1–5)
  - `notes` text
  - `created_at`, `updated_at`

All tables have Row Level Security (RLS) policies restricting access to `auth.uid()`. A database trigger automatically creates profile records on user signup.

---

## 🧭 Project Structure

```
rootly-notes-app/
├─ app/                # Next.js App Router pages
├─ components/         # UI components (shadcn-inspired + app-specific)
├─ hooks/              # Reusable hooks
├─ lib/                # Supabase clients, types, utils
├─ public/             # Icons and static assets
├─ scripts/            # SQL: create tables + seed sample data
├─ styles/             # Tailwind globals
└─ ...
```

Key UI building blocks live in `components/ui/*` and are composed throughout pages. Charts are located in `components/*-chart.tsx`.

---

## 🌗 Theming & UX

- Dark/light theme with system preference via `next-themes`
- Accessible primitives via Radix UI
- Consistent typography with Geist Sans/Mono

---

## 📈 Analytics & Exports

- Home charts for understanding, study time, mood, and course progress
- Notes export via the "Export" action on `/notes`

---

## 🤝 If you want to contribute

1) Fork and clone this repo, then create a branch off `main`.
2) Install deps and set env vars for your Supabase project.
3) In Supabase SQL editor, run: `01-create-tables.sql`, `02-seed-data.sql`, `03-multitenant-rls.sql`.
4) Enable Google/GitHub providers in Supabase; set `AUTH_REDIRECT_URL` to `/auth/callback` on your domain.
5) Start dev server, make focused commits, open a PR. Include screenshots for UI changes.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you encounter any issues or have questions:

1. Search existing [Issues](https://github.com/mo0hamed-shoaib/rootly-notes-app/issues) 
2. Create a [new issue](https://github.com/mo0hamed-shoaib/rootly-notes-app/issues/new/choose) with detailed information

---

<p align="center">Made with ❤️ for learners everywhere</p>
<p align="center">
  <img src="./public/jimmy-logo.svg" alt="Jimmy logo" width="50" height="50" style="vertical-align:middle;margin-right:6px;" />
</p>


