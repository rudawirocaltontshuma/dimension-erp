import { customers } from "@/data/erp/customers";
import { employees } from "@/data/erp/hr";
import { shipments } from "@/data/erp/logistics";
import { warehouses } from "@/data/erp/organisation";
import { purchaseOrders } from "@/data/erp/procurement";
import { products } from "@/data/erp/products";
import { projects } from "@/data/erp/projects";
import { invoices, orders } from "@/data/erp/sales";
import { suppliers } from "@/data/erp/suppliers";

export type SearchGroup =
  | "Customers"
  | "Products"
  | "Orders"
  | "Invoices"
  | "Suppliers"
  | "Purchase Orders"
  | "Employees"
  | "Projects"
  | "Shipments"
  | "Warehouses";

export interface SearchEntry {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

function entry(id: string, group: SearchGroup, title: string, subtitle: string, href: string): SearchEntry {
  return { id, group, title, subtitle, href, keywords: `${title} ${subtitle} ${id}`.toLowerCase() };
}

export const searchIndex: SearchEntry[] = [
  ...customers.map((customer) =>
    entry(
      customer.id,
      "Customers",
      customer.tradingName,
      `${customer.segment} · ${customer.billingAddress.city}`,
      `/customers/${customer.id}`,
    ),
  ),
  ...products.map((product) =>
    entry(product.id, "Products", product.name, `${product.sku} · ${product.category}`, `/products/${product.id}`),
  ),
  ...orders.map((order) =>
    entry(order.id, "Orders", order.reference, `${order.customerName} · ${order.status}`, `/orders/${order.id}`),
  ),
  ...invoices.map((invoice) =>
    entry(
      invoice.id,
      "Invoices",
      invoice.reference,
      `${invoice.customerName} · ${invoice.status}`,
      `/invoices/${invoice.id}`,
    ),
  ),
  ...suppliers.map((supplier) =>
    entry(
      supplier.id,
      "Suppliers",
      supplier.name,
      `${supplier.category} · ${supplier.city}`,
      `/suppliers/${supplier.id}`,
    ),
  ),
  ...purchaseOrders.map((order) =>
    entry(
      order.id,
      "Purchase Orders",
      order.reference,
      `${order.supplierName} · ${order.status}`,
      `/purchase-orders/${order.id}`,
    ),
  ),
  ...employees.map((employee) =>
    entry(
      employee.id,
      "Employees",
      employee.fullName,
      `${employee.jobTitle} · ${employee.department}`,
      `/employees/${employee.id}`,
    ),
  ),
  ...projects.map((project) =>
    entry(project.id, "Projects", project.name, `${project.client} · ${project.status}`, `/projects/${project.id}`),
  ),
  ...shipments.map((shipment) =>
    entry(
      shipment.id,
      "Shipments",
      shipment.reference,
      `${shipment.customerName} · ${shipment.status}`,
      `/shipments/${shipment.id}`,
    ),
  ),
  ...warehouses.map((warehouse) =>
    entry(
      warehouse.id,
      "Warehouses",
      warehouse.name,
      `${warehouse.city} · ${warehouse.status}`,
      `/warehouses/${warehouse.id}`,
    ),
  ),
];

export const searchGroupOrder: SearchGroup[] = [
  "Customers",
  "Products",
  "Orders",
  "Invoices",
  "Suppliers",
  "Purchase Orders",
  "Employees",
  "Projects",
  "Shipments",
  "Warehouses",
];

export function searchEntries(query: string, limit = 24): SearchEntry[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return searchIndex.filter((item) => item.keywords.includes(term)).slice(0, limit);
}
