# LOGISTIK UPL — Learning & Management Portal

A modern, responsive learning and management portal for logistics topics, built with **React + Vite + Tailwind CSS**.

## Features

- **8 pages**: Home, Dashboard, Learning, Projects, Daily Schedule, Activities, Resources, About
- **Fixed navbar** with active highlighting, mobile hamburger menu, live clock/date, dark/light mode toggle, notifications and profile menu
- **Full CRUD** for modules, projects, schedules, activities and resources — all persisted in **LocalStorage**
- **Daily Schedule** with Day / Week / Month views and colour-coded categories
- **Search, filter & sort** across all sections
- **Confirmation dialogs** before deleting, toast notifications for feedback
- **Print reports** (Projects, Activities) and **CSV export** (Activities)
- Sample data included so every feature works out of the box

## Getting Started

Requires **Node.js 18+**.

```bash
cd logistik-upl
npm install
npm run dev
```

Then open http://localhost:5173

### Other commands

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Project Structure

```
src/
├── components/     Navbar, Footer, shared UI (Modal, Toasts, Badge, ...)
├── context/        AppContext — theme, toasts, data + localStorage persistence
├── lib/            store.js — helpers, seed data, CSV/export utilities
└── pages/          Home, Dashboard, Learning, Projects, Schedule, Activities, Resources, About
```

## Notes

- Data is stored in the browser's LocalStorage (keys prefixed `lu_`). Clearing site data resets it to sample data.
- Activity image attachments are stored as compressed data URLs (max 2 MB).
