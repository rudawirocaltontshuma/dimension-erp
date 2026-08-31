# Dimension ERP

A production-grade Enterprise Resource Planning frontend, covering the operational spine of a real ERP system —
selling, buying, storing, moving, employing, delivering and reporting — across 70+ fully populated screens. Built with
Next.js, TypeScript, Tailwind CSS and shadcn/ui as a solid, reusable foundation other developers can build on.

> The current build ships as a frontend-only demonstration: every screen is complete and interactive, but data is generated locally and no backend is wired up yet. See [Connecting a backend](#connecting-a-backend) below.

---

## What this is

A full enterprise application shell and module set, ready to wire up to real data:

- A large, multi-module enterprise application already structured into clear domains (Sales, Procurement, Inventory,
  Finance, HR, Projects, Logistics, Reporting, Administration).
- A reusable component system that keeps 70+ screens consistent — data tables, dashboards, detail workspaces,
  document views and configuration screens.
- Domain models expressed as precise TypeScript types, ready to be backed by a real API or database.
- Enterprise UX patterns that work from 320px to ultrawide, in light and dark themes.

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

Every screen currently renders from data in `src/data/erp/*.ts`, generated at module load from **seeded
pseudo-random generators** (`src/data/erp/random.ts`), so the dataset stays:

- **Deterministic** — server and client renders always agree, so there are no hydration mismatches.
- **Realistic** — curated pools of names, locations, product categories and supplier names produce believable,
  non-round values, primarily in ZAR (`R 1,284,500.00`) with some USD, EUR and GBP examples.
- **Substantial** — 44 customers, 65 products, 92 orders, 62 invoices, 38 quotes, 34 suppliers, 48 purchase orders,
  150+ inventory records, 120 stock movements, 46 employees, 22 projects, 86 tasks, 64 shipments, 148 transactions and
  18 notifications, with varied statuses throughout.

Dates are anchored to a fixed reference "today" (30 June 2026) so ageing, timelines and trends stay coherent. This
gives every module a realistic dataset to develop against from day one, without needing a backend running first.

---

## Connecting a backend

The data layer is deliberately isolated so it's straightforward to swap out:

1. Each module's page reads from a single data module in `src/data/erp/` (e.g. `orders.ts`, `customers.ts`). Replace
   the exported arrays/functions with calls to your API, database client or ORM of choice.
2. The domain types in `src/types/erp.ts` describe the shape every screen expects — implement your backend against
   them, or adjust them to match your schema and let TypeScript surface every call site that needs updating.
3. Actions currently shown as toast-only feedback ("Save Demo", export, approve, etc., in
   `src/components/erp/demo-actions.tsx` and `demo-form-dialog.tsx`) are the natural places to wire in real mutations
   — server actions, API calls or a client-side data layer such as TanStack Query.
4. Authentication, authorization and multi-tenant company scoping (the company switcher) are not implemented and
   will need to be added for production use.

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

## Current state

Out of the box, this is a frontend-only build: every screen is complete and interactive, but all data is fictional
and generated locally, and no backend, database, authentication provider, financial service, banking service or
payment provider is connected. All companies, people, customers, suppliers, employees, documents and financial
figures shown are fictional. Buttons that save, approve, export or send currently display interface feedback only —
see [Connecting a backend](#connecting-a-backend) for how to make them real.

## License

MIT — see [LICENSE](./LICENSE).
