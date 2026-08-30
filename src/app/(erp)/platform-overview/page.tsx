import Link from "next/link";

import {
  ArrowRight,
  Banknote,
  Boxes,
  Component,
  Gauge,
  Handshake,
  LayoutDashboard,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Table2,
  Truck,
  Users,
} from "lucide-react";

import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { customers } from "@/data/erp/customers";
import { transactions } from "@/data/erp/finance";
import { employees } from "@/data/erp/hr";
import { inventoryRecords } from "@/data/erp/inventory";
import { shipments } from "@/data/erp/logistics";
import { COMPANY } from "@/data/erp/organisation";
import { purchaseOrders } from "@/data/erp/procurement";
import { products } from "@/data/erp/products";
import { projects } from "@/data/erp/projects";
import { invoices, orders } from "@/data/erp/sales";
import { suppliers } from "@/data/erp/suppliers";
import { formatNumber } from "@/lib/erp/format";

const MODULES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Executive overview with KPI cards, eight chart views and ten operational widgets.",
    href: "/dashboard",
  },
  {
    icon: ShoppingCart,
    title: "Operations & Sales",
    description: "Orders, quotes, sales orders, invoices, payments and customer profiles.",
    href: "/sales",
  },
  {
    icon: Handshake,
    title: "Procurement",
    description: "Suppliers, requisitions, purchase orders, goods receipts and payables.",
    href: "/procurement",
  },
  {
    icon: Boxes,
    title: "Inventory",
    description: "Stock levels, movements, transfers, adjustments and warehouse capacity.",
    href: "/inventory",
  },
  {
    icon: Banknote,
    title: "Finance",
    description: "Chart of accounts, transactions, expenses and full financial statements.",
    href: "/finance",
  },
  {
    icon: Users,
    title: "Human Resources",
    description: "Employees, departments, attendance, leave, payroll and performance.",
    href: "/hr",
  },
  {
    icon: Rocket,
    title: "Projects",
    description: "Portfolio health, project workspaces, task board and cost capture.",
    href: "/projects",
  },
  {
    icon: Truck,
    title: "Logistics",
    description: "Shipments, deliveries, routes, fleet management and consignment tracking.",
    href: "/logistics",
  },
  {
    icon: Gauge,
    title: "Reports",
    description: "Report centre with sales, finance, inventory, procurement, HR and operational packs.",
    href: "/reports",
  },
];

const CAPABILITIES = [
  {
    icon: Component,
    title: "Component architecture",
    description:
      "A reusable component kit — KPI cards, data tables, chart wrappers, status badges, timelines, empty and error states — composed across every screen.",
  },
  {
    icon: Table2,
    title: "Advanced data tables",
    description:
      "TanStack Table powers sorting, pagination and column visibility, with search and faceted filters that move into a sheet on mobile.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive by design",
    description:
      "Layouts adapt from 320px to ultrawide: drawer navigation, stacked cards, horizontally scrolling tables and single-column forms.",
  },
  {
    icon: Gauge,
    title: "Data visualisation",
    description:
      "Recharts line, area, bar, pie and donut charts with tooltips, legends and responsive containers, readable in both themes.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible interactions",
    description:
      "Semantic markup, labelled controls, keyboard-navigable tables and dialogs, visible focus states and descriptive aria labels.",
  },
  {
    icon: LayoutDashboard,
    title: "Enterprise UX patterns",
    description:
      "Breadcrumbs, detail drawers, confirmation dialogs, toasts, print styling and a command palette bound to Cmd/Ctrl + K.",
  },
];

const STACK = [
  "Next.js App Router",
  "React 19",
  "TypeScript (strict)",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Radix primitives",
  "TanStack Table v9",
  "Recharts",
  "react-hook-form",
  "Zod",
  "Lucide icons",
  "Sonner toasts",
  "Zustand preferences",
  "Biome",
];

export default function PlatformOverviewPage() {
  const dataPoints = [
    { label: "Customers", value: customers.length },
    { label: "Products", value: products.length },
    { label: "Orders", value: orders.length },
    { label: "Invoices", value: invoices.length },
    { label: "Suppliers", value: suppliers.length },
    { label: "Purchase orders", value: purchaseOrders.length },
    { label: "Inventory records", value: inventoryRecords.length },
    { label: "Employees", value: employees.length },
    { label: "Projects", value: projects.length },
    { label: "Shipments", value: shipments.length },
    { label: "Transactions", value: transactions.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Overview"
        description={`${COMPANY.name} — ${COMPANY.subtitle}. A frontend-only enterprise resource planning platform demonstration built with fictional data.`}
        breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Platform Overview" }]}
        meta={
          <div className="pt-1">
            <StatusBadge status="Demo mode — fictional data only" tone="warning" />
          </div>
        }
        actions={
          <Button asChild size="sm">
            <Link prefetch={false} href="/dashboard">
              Open the dashboard
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <SectionCard
        title="What Enterprise ERP is"
        description="A demonstration of enterprise frontend engineering, not a production system."
      >
        <div className="space-y-3 text-sm">
          <p>
            Enterprise ERP presents the interface of a mid-sized South African distribution and manufacturing group. It
            covers the operational spine of an ERP platform: selling, buying, storing, moving, employing, delivering and
            reporting — each as a fully populated set of screens.
          </p>
          <p className="text-muted-foreground">
            Every figure, customer, supplier, employee and document in the platform is fictional and generated
            deterministically from local TypeScript files. There is no database, no authentication provider, no payment
            or banking integration and no external business system. Actions such as saving, approving or exporting show
            realistic interface feedback without persisting anything.
          </p>
        </div>
      </SectionCard>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Modules" value={formatNumber(MODULES.length)} hint="Fully populated functional areas" />
        <KpiCard label="Routes" value="60+" hint="Every navigation link resolves to real content" />
        <KpiCard
          label="Mock records"
          value={formatNumber(dataPoints.reduce((sum, entry) => sum + entry.value, 0))}
          hint="Across all core entities"
        />
        <KpiCard label="Persistence" value="None" hint="Frontend demonstration only" />
      </section>

      <SectionCard
        title="Modules"
        description="Each module leads to real, populated screens with filters, detail views and charts."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <div key={module.title} className="flex flex-col justify-between gap-3 rounded-lg border p-4">
              <div className="space-y-2">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <module.icon aria-hidden className="size-4" />
                </span>
                <p className="font-medium text-sm">{module.title}</p>
                <p className="text-muted-foreground text-sm">{module.description}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link prefetch={false} href={module.href}>
                  Open module
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Technical capabilities"
        description="What this project demonstrates from an engineering perspective."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <div key={capability.title} className="space-y-2 rounded-lg border p-4">
              <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <capability.icon aria-hidden className="size-4" />
              </span>
              <p className="font-medium text-sm">{capability.title}</p>
              <p className="text-muted-foreground text-sm">{capability.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Technology stack" description="Libraries and tooling used to build the demonstration.">
          <ul className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <li key={item}>
                <StatusBadge status={item} tone="neutral" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Mock data volumes" description="Deterministically generated records held in src/data/erp.">
          <ul className="divide-y">
            {dataPoints.map((entry) => (
              <li key={entry.label} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm">{entry.label}</span>
                <span className="font-medium text-sm tabular-nums">{formatNumber(entry.value)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Demo data disclaimer">
        <p className="text-muted-foreground text-sm">
          This project is a frontend-only enterprise ERP demonstration. It uses fictional mock data and does not connect
          to a production database, authentication provider, financial service, banking service, payment provider or
          external business system.
        </p>
      </SectionCard>
    </div>
  );
}
