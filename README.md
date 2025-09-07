<p align="center">
  <img alt="Rootly Notes - Your learning journey tracker" src="public/rootly-banner.png" width="1200" />
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Radix UI" src="https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radixui&logoColor=white" />
  <img alt="Recharts" src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge" />
</p>

<p align="center">
  <img alt="Node 18.18+" src="https://img.shields.io/badge/Node-18.18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="pnpm 9+" src="https://img.shields.io/badge/pnpm-9%2B-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
  <a href="https://vercel.com/new" target="_blank"><img alt="Deploy with Vercel" src="https://img.shields.io/badge/Deploy%20with-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

<p align="center">
  <a href="https://rootly-notes.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20ROOTLY-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
</p>

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment & Sessions](#environment--sessions)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Overview

Elegant, data-driven learning tracker built with Next.js and Supabase. Capture Q&A notes, organize by courses, log daily study time and mood, and practice with a quick review session — all in a sleek, responsive UI.

---

## ✨ Features

- **Home overview**: Total courses, notes, average understanding, and study time (last 30 days) with rich charts
- **Notes management**: Capture questions and answers, filter by course/understanding/flagged, full-text search, export to JSON/CSV
- **Courses**: Track learning resources with links and topics; see per-course note counts
- **Daily entries**: Log study time and mood per day
- **Practice mode**: Quick quiz session with shuffle/filters to focus on flagged or specific courses
- **Beautiful UI**: Radix UI + Tailwind + Geist font, dark/light theme with system preference

Routes:

| Path | Description |
|------|-------------|
| `/` | Overview Home |
| `/notes` | Notes grid, filters, export |
| `/courses` | Course management |
| `/daily` | Daily study and mood tracking |
| `/review` | Practice session |
| `/about`, `/how-it-works` | Informational pages |

---

## 🧱 Tech Stack

- **Frontend**: Next.js App Router (v15), React 19, TypeScript, Tailwind CSS v4, next-themes, Radix UI primitives, Lucide icons
- **Charts**: Recharts
- **Backend/data**: Supabase (PostgreSQL + Row Level Cookies for session management)
- **Styling**: Tailwind + shadcn-inspired UI components in `components/ui`

---

 

## ⚙️ Prerequisites

- Node.js 18.18+ or 20+
- pnpm 9+ (or npm/yarn if preferred)
- A Supabase project (free tier is fine)

---

## 🚀 Quick Start

1) **Clone the repository**

```bash
git clone https://github.com/yourusername/rootly-notes-app.git
cd rootly-notes-app
```

2) **Install dependencies**

```bash
pnpm install
```

3) **Create `.env.local`**

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
# Social Media Links in Footer
NEXT_PUBLIC_GITHUB_URL=www.github.com/user
NEXT_PUBLIC_LINKEDIN_URL=www.linkedin.com/user

# Deploy Link used for metadata and canonical URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4) **Set up the database** (Supabase SQL editor)

- Open Supabase → SQL Editor → Run both scripts in `scripts/`:
  - `01-create-tables.sql` (tables, indexes, triggers)
  - `02-seed-data.sql` (sample courses, notes, daily entries)

5) **Start the development server**

```bash
pnpm dev
```

Visit `http://localhost:3000`.

---

## 🔐 Environment & Sessions

This project is single-user and does not require auth. Supabase is used purely as a database with the public anon key. A middleware is included to keep Supabase SSR cookies consistent.

Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional)

See:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `middleware.ts`

---

## 🗃️ Data Model

Tables created by `scripts/01-create-tables.sql`:

- `courses`
  - `id` UUID (PK)
  - `instructor` text
  - `title` text
  - `links` text[]
  - `topics` text[]
  - `created_at`, `updated_at`

- `notes`
  - `id` UUID (PK)
  - `course_id` UUID → `courses.id`
  - `question` text
  - `answer` text (default "")
  - `understanding_level` int (1–5)
  - `flag` boolean
  - `created_at`, `updated_at`

- `daily_entries`
  - `id` UUID (PK)
  - `date` date (unique per day)
  - `study_time` int (minutes)
  - `mood` int (1–5)
  - `notes` text
  - `created_at`, `updated_at`

Indexes are included for common filters and a trigger keeps `updated_at` fresh.

---

## 📦 Scripts

From `package.json`:

```bash
pnpm dev      # Start Next.js in dev mode
pnpm build    # Production build
pnpm start    # Start production server (after build)
pnpm lint     # Next.js lint
```

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

## 🛠️ Deployment

- Works great on Vercel. Set the same environment variables in your project settings.
- Next.js config has `images.unoptimized` set to `true` for portability.

---

## 🧩 Troubleshooting

- Blank lists or zero stats: ensure you ran both SQL scripts in `scripts/`.
- 401/keys errors: check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
- Type or lint warnings: the project ignores type/lint errors during build to ease setup; fix as desired.

---

## 🤝 Acknowledgements

- UI components inspired by shadcn/ui patterns
- Fonts: Geist
- Icons: Lucide
- Charts: Recharts
- Data layer: Supabase

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [Issues](https://github.com/yourusername/rootly-notes-app/issues) 
3. Create a new issue with detailed information

## 🧰 Maintainer Notes

- No authentication is implemented by design (single-user). If you need multi-user auth, wire up Supabase Auth and row-level security policies, then gate routes in `middleware.ts`.
- Consider replacing the anon key with a stricter service architecture if you deploy publicly.

---

<p align="center">Made with ❤️ for learners everywhere</p>

