# Enterprise ERP — Enterprise Resource Planning Platform

Enterprise ERP is a complete, high-fidelity **frontend demonstration** of an enterprise resource planning platform for a
fictional South African distribution and manufacturing group, *Enterprise Holdings*. It covers the operational spine of a
real ERP system — selling, buying, storing, moving, employing, delivering and reporting — across more than seventy
fully populated screens.

> This project is a frontend-only enterprise ERP demonstration created for portfolio purposes. It uses fictional mock data and does not connect to a production database, authentication provider, financial service, banking service, payment provider or external business system.

---

## Purpose

The project exists to demonstrate advanced frontend engineering to prospective clients and employers:

- Designing and structuring a large, multi-module enterprise application.
- Building a reusable component system that keeps sixty-plus screens consistent.
- Modelling realistic business data with precise TypeScript types.
- Delivering enterprise UX patterns — dense data tables, detail workspaces, dashboards, document views and
  configuration screens — that remain usable from 320px to ultrawide displays, in light and dark themes.

It is **not** a production system. Nothing is persisted, no transactions are processed, and every record is fictional.

---

## Feature highlights

- **Application shell** — collapsible sidebar with grouped navigation and tooltips when collapsed, sticky header,
  company switcher (Enterprise Holdings / Distribution / Manufacturing), notification centre, demo profile menu, theme
  switcher and a persistent DEMO MODE badge.
- **Global search and command palette** — `Cmd/Ctrl + K` opens a categorised search across customers, products,
  orders, invoices, suppliers, purchase orders, employees, projects, shipments and warehouses, plus quick navigation
  commands and a theme toggle.
- **Dashboard** — eight KPI cards, seven chart views (revenue trend, sales performance, revenue by category,
  inventory distribution, order status, procurement spend, expense breakdown) and ten operational widgets.
- **Advanced data tables** — TanStack Table v9 with search, faceted filters, sorting, pagination, column visibility
  and row-click navigation. Filters render inline on desktop and inside a sheet on mobile.
- **Detail workspaces** — tabbed profiles for customers, products, employees and projects; document views for orders,
  invoices, quotes, purchase orders and shipments, each with a reusable activity timeline.
- **Printable documents** — invoices, purchase orders, statements and reports use dedicated print styling.
- **Forms** — react-hook-form with Zod validation, presented in dialogs with labels, descriptions, required
  indicators, validation errors, Cancel and “Save Demo” (which raises a toast; nothing is saved).
- **Administration** — company, locations, departments, currencies, tax, system preferences, document numbering,
  notification routing and appearance, all with working local UI state.

---

## Modules

| Module | Screens |
| --- | --- |
| Dashboard | Enterprise overview, platform overview |
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

Every navigation link resolves to a real, populated screen — there are no placeholder or “coming soon” pages.

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
│   │   ├── dashboard/         # Enterprise overview
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
(`src/data/erp/random.ts`). Seeding keeps the dataset:

- **Deterministic** — the server render and client render always agree, so there are no hydration mismatches, and the
  demo looks identical on every visit.
- **Believable** — curated pools of South African names, cities, product categories and supplier names produce
  realistic, non-round values, primarily in ZAR (`R 1,284,500.00`) with some USD, EUR and GBP examples.
- **Substantial** — 44 customers, 65 products, 92 orders, 62 invoices, 38 quotes, 34 suppliers, 48 purchase orders,
  150+ inventory records, 120 stock movements, 46 employees, 22 projects, 86 tasks, 64 shipments, 148 transactions and
  18 notifications, with varied statuses throughout.

Dates are anchored to a fixed demonstration “today” (30 June 2026) so that ageing, timelines and trends stay coherent.

---

## Screenshots

Screenshots are not committed to this repository. To capture your own, run the development server and visit
`/dashboard`, `/orders/ORD-10401`, `/invoices/INV-2026001`, `/reports/profit-loss` and `/projects` in both light and
dark themes.

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

All companies, people, customers, suppliers, employees, documents and financial figures shown in Enterprise ERP are
fictional. Buttons that save, approve, export or send display interface feedback only — no data is stored, transmitted
or processed.
