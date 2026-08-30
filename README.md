# Enterprise ERP

A frontend-only demonstration of an Enterprise Resource Planning platform, built as a portfolio project to show what a
production-grade ERP frontend for an enterprise company could look like — the operational spine of a real ERP system
(selling, buying, storing, moving, employing, delivering, reporting) across 70+ fully populated screens.

> This project is a frontend-only enterprise ERP demonstration created for portfolio purposes. It uses fictional mock data and does not connect to a production database, authentication provider, financial service, banking service, payment provider or external business system.

---

## Purpose

Built to demonstrate advanced frontend engineering:

- Structuring a large, multi-module enterprise application.
- A reusable component system that keeps 70+ screens consistent.
- Modelling realistic business data with precise TypeScript types.
- Enterprise UX patterns — dense data tables, detail workspaces, dashboards, document views and configuration
  screens — usable from 320px to ultrawide, in light and dark themes.

It is **not** a production system. Nothing is persisted, no transactions are processed, and every record is fictional.

---

## Features

- **Application shell** — collapsible sidebar with grouped navigation, sticky header, company switcher, notification
  centre, demo profile menu, theme switcher, persistent DEMO MODE badge.
- **Global search and command palette** — `Cmd/Ctrl + K` opens categorised search across customers, products, orders,
  invoices, suppliers, purchase orders, employees, projects, shipments and warehouses, plus navigation commands and a
  theme toggle.
- **Dashboard** — KPI cards, seven chart views and ten operational widgets.
- **Advanced data tables** — TanStack Table v9 with search, faceted filters, sorting, pagination, column visibility
  and row-click navigation. Filters render inline on desktop, inside a sheet on mobile.
- **Detail workspaces** — tabbed profiles for customers, products, employees and projects; document views for orders,
  invoices, quotes, purchase orders and shipments, each with a reusable activity timeline.
- **Printable documents** — invoices, purchase orders, statements and reports use dedicated print styling.
- **Forms** — react-hook-form with Zod validation, in dialogs with labels, descriptions, required indicators,
  validation errors, Cancel and "Save Demo" (raises a toast; nothing is saved).
- **Administration** — company, locations, departments, currencies, tax, system preferences, document numbering,
  notification routing and appearance, all with working local UI state.

---

## Modules

| Module | Screens |
| --- | --- |
| Dashboard | Overview, platform overview |
| Operations | Orders, order detail, customers, customer profile, products, product detail, inventory, warehouses, warehouse detail, shipments |
| Sales | Sales overview, quotes, quote detail, sales orders, invoices, invoice document, payments |
| Procurement | Procurement overview, suppliers, supplier detail, purchase requests, purchase orders, purchase order detail, goods receipts, supplier invoices |
| Inventory | Inventory overview, stock levels, stock movements, transfers, adjustments, warehouses |
| Finance | Finance overview, chart of accounts, transactions, expenses, payments, invoices |
| Human Resources | HR overview, employees, employee profile, departments, attendance, leave, payroll, performance |
| Projects | Project overview, projects, project workspace, tasks (list and board), project costs |
| Logistics | Logistics overview, shipments, shipment tracking, deliveries, routes, vehicles, tracking |
| Reports | Report centre, profit & loss, balance sheet, cash flow, sales, inventory, procurement, HR, finance, operational |
| Administration | Company, locations, departments, currencies, tax settings, system preferences, numbering, notifications, appearance |

Every navigation link resolves to a real, populated screen — no placeholder or "coming soon" pages.

---

## Tech stack

- **Framework** — Next.js (App Router), React 19
- **Language** — TypeScript in strict mode
- **Styling** — Tailwind CSS v4 with semantic theme tokens
- **UI** — shadcn/ui components built on Radix primitives
- **Tables** — TanStack Table v9
- **Charts** — Recharts
- **Forms** — react-hook-form with Zod resolvers
- **Icons** — Lucide
- **Notifications** — Sonner
- **Preferences** — Zustand store with cookie-backed theme and layout preferences
- **Tooling** — Biome for linting and formatting

No backend, database, ORM, authentication provider, payment gateway or external API is used anywhere in the project.

---

## Architecture

```
src/
├── app/
│   ├── (erp)/                 # The ERP application shell and every route
│   │   ├── _components/       # Sidebar, header, command palette, notifications, company switcher
│   │   ├── dashboard/         # Overview
│   │   ├── orders/ customers/ products/ …
│   │   ├── reports/           # Report centre and statement views
│   │   └── settings/          # Administration section with its own layout and nav
│   ├── globals.css            # Theme tokens, presets and print styling
│   └── layout.tsx             # Root layout, fonts, toaster, preference provider
├── components/
│   ├── erp/                   # Reusable ERP kit (see below)
│   └── ui/                    # shadcn/ui primitives
├── data/erp/                  # Deterministic mock data generators and datasets
├── lib/erp/                   # Currency/date formatting, status tones, search index
├── navigation/                # Sidebar navigation and quick command definitions
└── types/erp.ts               # Domain types for every entity
```

**Reusable ERP kit** (`src/components/erp/`): `kpi-card`, `data-table`, `table-columns`, `page-header` (with
breadcrumbs), `status-badge`, `charts` (line, area, bar, pie/donut, progress meter), `activity-timeline`,
`detail-panels` (info grid, section card, avatar group, stat row), `demo-actions` (toast actions, print, drawer,
confirm dialog), `demo-form-dialog` and `states` (empty, error, skeletons).

---

## Mock data approach

All data lives in `src/data/erp/*.ts` and is generated at module load from **seeded pseudo-random generators**
(`src/data/erp/random.ts`), so the dataset stays:

- **Deterministic** — server and client renders always agree, so there are no hydration mismatches.
- **Believable** — curated pools of names, locations, product categories and supplier names produce realistic,
  non-round values, primarily in ZAR (`R 1,284,500.00`) with some USD, EUR and GBP examples.
- **Substantial** — 44 customers, 65 products, 92 orders, 62 invoices, 38 quotes, 34 suppliers, 48 purchase orders,
  150+ inventory records, 120 stock movements, 46 employees, 22 projects, 86 tasks, 64 shipments, 148 transactions and
  18 notifications, with varied statuses throughout.

Dates are anchored to a fixed demonstration "today" (30 June 2026) so ageing, timelines and trends stay coherent.

---

## Local development

```bash
npm install
npm run dev
```

The application is served at `http://localhost:3000` and redirects to `/dashboard`.

Other useful commands:

```bash
npm run build      # Production build
npm run lint       # Biome lint
npm run check      # Biome lint + format check
npm run check:fix  # Apply safe fixes
npm run format     # Format with Biome
```

---

## Project structure conventions

- Route-specific components live beside the route in `_components/`; shared components live in `src/components/`.
- Server Components render static content; interactive screens are Client Components.
- Domain types are centralised in `src/types/erp.ts`; `any` is not used.
- Styling uses semantic theme tokens so every screen works in light mode, dark mode and the bundled theme presets.

---

## Portfolio disclaimer

This project is a frontend-only enterprise ERP demonstration created for portfolio purposes. It uses fictional mock data and does not connect to a production database, authentication provider, financial service, banking service, payment provider or external business system.

All companies, people, customers, suppliers, employees, documents and financial figures shown are fictional. Buttons
that save, approve, export or send display interface feedback only — no data is stored, transmitted or processed.
