import {
  ArrowLeftRight,
  BadgePercent,
  Banknote,
  Boxes,
  Building2,
  CalendarCheck,
  ChartColumn,
  ChartPie,
  ClipboardCheck,
  ClipboardList,
  Coins,
  Compass,
  Container,
  CreditCard,
  FileSpreadsheet,
  FileStack,
  FileText,
  Gauge,
  Handshake,
  Landmark,
  LayoutDashboard,
  type LucideIcon,
  Map as MapIcon,
  MapPin,
  Package,
  PackageCheck,
  PackageSearch,
  Percent,
  Radar,
  ReceiptText,
  Rocket,
  Route,
  Scale,
  Settings,
  ShoppingCart,
  Sparkles,
  Truck,
  UserRound,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";

export interface ErpNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export interface ErpNavGroup {
  id: string;
  label: string;
  items: ErpNavItem[];
}

export const erpNavigation: ErpNavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, description: "Enterprise overview" },
      {
        title: "Platform Overview",
        url: "/platform-overview",
        icon: Sparkles,
        description: "About this demonstration",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { title: "Orders", url: "/orders", icon: ShoppingCart },
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Products", url: "/products", icon: Package },
      { title: "Inventory", url: "/inventory", icon: Boxes },
      { title: "Warehouses", url: "/warehouses", icon: Warehouse },
      { title: "Shipments", url: "/shipments", icon: Truck },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { title: "Sales Overview", url: "/sales", icon: ChartColumn },
      { title: "Quotes", url: "/quotes", icon: FileText },
      { title: "Sales Orders", url: "/sales-orders", icon: ClipboardList },
      { title: "Invoices", url: "/invoices", icon: ReceiptText },
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Customers", url: "/customers", icon: Users },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    items: [
      { title: "Procurement Overview", url: "/procurement", icon: Handshake },
      { title: "Suppliers", url: "/suppliers", icon: Building2 },
      { title: "Purchase Requests", url: "/purchase-requests", icon: ClipboardCheck },
      { title: "Purchase Orders", url: "/purchase-orders", icon: FileStack },
      { title: "Goods Receipts", url: "/goods-receipts", icon: PackageCheck },
      { title: "Supplier Invoices", url: "/supplier-invoices", icon: FileSpreadsheet },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    items: [
      { title: "Inventory Overview", url: "/inventory", icon: Boxes },
      { title: "Products", url: "/products", icon: Package },
      { title: "Stock Levels", url: "/stock-levels", icon: PackageSearch },
      { title: "Stock Movements", url: "/stock-movements", icon: ArrowLeftRight },
      { title: "Transfers", url: "/transfers", icon: Container },
      { title: "Adjustments", url: "/adjustments", icon: Scale },
      { title: "Warehouses", url: "/warehouses", icon: Warehouse },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { title: "Finance Overview", url: "/finance", icon: Banknote },
      { title: "Accounts", url: "/accounts", icon: Landmark },
      { title: "Transactions", url: "/transactions", icon: Coins },
      { title: "Invoices", url: "/invoices", icon: ReceiptText },
      { title: "Expenses", url: "/expenses", icon: Wallet },
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Financial Reports", url: "/reports/finance", icon: ChartPie },
    ],
  },
  {
    id: "hr",
    label: "Human Resources",
    items: [
      { title: "HR Overview", url: "/hr", icon: Gauge },
      { title: "Employees", url: "/employees", icon: UserRound },
      { title: "Departments", url: "/departments", icon: Building2 },
      { title: "Attendance", url: "/attendance", icon: CalendarCheck },
      { title: "Leave", url: "/leave", icon: ClipboardList },
      { title: "Payroll Overview", url: "/payroll", icon: Banknote },
      { title: "Performance", url: "/performance", icon: BadgePercent },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    items: [
      { title: "Project Overview", url: "/projects/overview", icon: Compass },
      { title: "Projects", url: "/projects", icon: Rocket },
      { title: "Tasks", url: "/tasks", icon: ClipboardCheck },
      { title: "Project Costs", url: "/project-costs", icon: Coins },
    ],
  },
  {
    id: "logistics",
    label: "Logistics",
    items: [
      { title: "Logistics Overview", url: "/logistics", icon: Truck },
      { title: "Shipments", url: "/shipments", icon: Container },
      { title: "Deliveries", url: "/deliveries", icon: PackageCheck },
      { title: "Routes", url: "/logistics/routes", icon: Route },
      { title: "Vehicles", url: "/vehicles", icon: MapIcon },
      { title: "Tracking", url: "/tracking", icon: Radar },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      { title: "Executive Reports", url: "/reports", icon: ChartPie },
      { title: "Sales Reports", url: "/reports/sales", icon: ChartColumn },
      { title: "Inventory Reports", url: "/reports/inventory", icon: Boxes },
      { title: "Procurement Reports", url: "/reports/procurement", icon: Handshake },
      { title: "Finance Reports", url: "/reports/finance", icon: Banknote },
      { title: "HR Reports", url: "/reports/hr", icon: Users },
      { title: "Operational Reports", url: "/reports/operational", icon: Gauge },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      { title: "Company", url: "/settings/company", icon: Building2 },
      { title: "Departments", url: "/settings/departments", icon: Users },
      { title: "Locations", url: "/settings/locations", icon: MapPin },
      { title: "Currencies", url: "/settings/currencies", icon: Coins },
      { title: "Tax Settings", url: "/settings/tax", icon: Percent },
      { title: "System Preferences", url: "/settings/system", icon: Settings },
    ],
  },
];

export const quickCommands: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Go to Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Go to Orders", url: "/orders", icon: ShoppingCart },
  { title: "Go to Customers", url: "/customers", icon: Users },
  { title: "Go to Products", url: "/products", icon: Package },
  { title: "Go to Inventory", url: "/inventory", icon: Boxes },
  { title: "Go to Sales", url: "/sales", icon: ChartColumn },
  { title: "Go to Procurement", url: "/procurement", icon: Handshake },
  { title: "Go to Finance", url: "/finance", icon: Banknote },
  { title: "Go to Human Resources", url: "/hr", icon: Gauge },
  { title: "Go to Projects", url: "/projects", icon: Rocket },
  { title: "Go to Logistics", url: "/logistics", icon: Truck },
  { title: "Go to Reports", url: "/reports", icon: ChartPie },
  { title: "Open Settings", url: "/settings", icon: Settings },
];
