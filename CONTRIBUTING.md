# Contributing to Enterprise ERP

Thanks for your interest in improving **Enterprise ERP**. This guide covers how to set up your environment and
where to make changes.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It's a
frontend-only Enterprise Resource Planning application — no backend, database, or authentication provider — so the
focus for contributions is UI, UX, component architecture, and mock data quality.

---

## Project Layout

The application lives under `src/app/(erp)/`, with one directory per route and shared UI split into a reusable
ERP component kit.

```
src
├── app
│   └── (erp)               # The ERP application shell and every route
│       ├── _components/     # Sidebar, header, command palette, notifications, company switcher
│       ├── dashboard/       # Overview
│       ├── orders/ customers/ products/ …
│       ├── reports/         # Report centre and statement views
│       └── settings/        # Administration section
├── components
│   ├── erp/                 # Reusable ERP kit (data table, KPI card, charts, timelines, etc.)
│   └── ui/                  # shadcn/ui primitives
├── data/erp/                 # Deterministic mock data generators and datasets
├── lib/erp/                  # Currency/date formatting, status tones, search index
├── navigation/                # Sidebar navigation and command palette definitions
└── types/erp.ts               # Domain types for every entity
```

See [README.md](./README.md) for the full architecture and module list.

---

## Getting Started

1. **Fork the repository**, then clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/enterprise_erp.git
   cd enterprise_erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   The app is available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add stock adjustment detail view"
  ```

- Open a Pull Request once ready. If your change adds a new screen or component, include a screenshot in the PR
  description.

---

## Where to Contribute

- **Routes/screens**: `src/app/(erp)/<module>/` — each module (orders, customers, finance, HR, etc.) follows the
  same page/detail-page pattern.
- **Reusable components**: `src/components/erp/` for ERP-specific building blocks, `src/components/ui/` for
  shadcn/ui primitives.
- **Mock data**: `src/data/erp/` — keep new records realistic and internally consistent (see the seeded generator
  approach in `random.ts`).
- **Domain types**: `src/types/erp.ts`.

---

## Guidelines

- Prefer explicit **TypeScript types** over `any`.
- Husky pre-commit hooks run linting and formatting automatically; a commit is blocked until issues are fixed.
- Follow existing shadcn/ui and Tailwind v4 conventions already used in the codebase.
- Keep accessibility in mind (semantic HTML, ARIA labels, keyboard navigation, focus states).
- Keep mock data fictional and non-round; avoid real personal information.
- Avoid unnecessary dependencies — prefer what's already installed.

---

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting.
- Run `npm run check` (lint + format) and `npm run build` locally before opening a PR.
- Reference any related issue for context.

---

## Questions & Support

Report bugs or suggestions via [GitHub Issues](https://github.com/rudawirocaltontshuma/enterprise_erp/issues).
