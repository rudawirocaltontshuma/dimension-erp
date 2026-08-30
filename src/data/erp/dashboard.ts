import { customers } from "./customers";
import { expenses, financeSummary } from "./finance";
import { inventoryByCategory, inventorySummary, lowStockItems } from "./inventory";
import { logisticsSummary } from "./logistics";
import { purchaseOrders } from "./procurement";
import { products } from "./products";
import { projectSummary } from "./projects";
import { invoices, orders } from "./sales";

export const revenueTrend = [
  { month: "Jul", revenue: 12846200, target: 12500000, lastYear: 11284600 },
  { month: "Aug", revenue: 13418600, target: 12800000, lastYear: 11842000 },
  { month: "Sep", revenue: 12984300, target: 13100000, lastYear: 12184500 },
  { month: "Oct", revenue: 14284900, target: 13400000, lastYear: 12648200 },
  { month: "Nov", revenue: 15842700, target: 14000000, lastYear: 13284600 },
  { month: "Dec", revenue: 16948300, target: 15200000, lastYear: 14184900 },
  { month: "Jan", revenue: 13284600, target: 14200000, lastYear: 12048300 },
  { month: "Feb", revenue: 14618400, target: 14400000, lastYear: 12842700 },
  { month: "Mar", revenue: 15284600, target: 14800000, lastYear: 13184200 },
  { month: "Apr", revenue: 16418200, target: 15200000, lastYear: 13948600 },
  { month: "May", revenue: 15948400, target: 15600000, lastYear: 14284100 },
  { month: "Jun", revenue: 14958890, target: 15800000, lastYear: 13842900 },
];

export const salesPerformance = [
  { channel: "Direct Sales", revenue: 48426180, orders: 284 },
  { channel: "Field Sales", revenue: 36842190, orders: 212 },
  { channel: "Online Portal", revenue: 22184600, orders: 486 },
  { channel: "Distributor", revenue: 41284900, orders: 168 },
  { channel: "Tender", revenue: 18426400, orders: 42 },
];

export const revenueByCategory = [
  { category: "Power Tools", revenue: 32846190 },
  { category: "Electrical", revenue: 28418600 },
  { category: "Automation", revenue: 24186400 },
  { category: "Safety", revenue: 19842700 },
  { category: "Mechanical", revenue: 16284900 },
  { category: "Packaging", revenue: 12948300 },
  { category: "Other", revenue: 21894860 },
];

export const orderStatusBreakdown = [
  { status: "Pending", count: orders.filter((order) => order.status === "Pending").length },
  { status: "Processing", count: orders.filter((order) => order.status === "Processing").length },
  { status: "Completed", count: orders.filter((order) => order.status === "Completed").length },
  { status: "Cancelled", count: orders.filter((order) => order.status === "Cancelled").length },
];

export const procurementSpend = [
  { month: "Jan", spend: 8426190 },
  { month: "Feb", spend: 9184600 },
  { month: "Mar", spend: 10284900 },
  { month: "Apr", spend: 11842600 },
  { month: "May", spend: 10948300 },
  { month: "Jun", spend: 9846200 },
];

export const expenseBreakdown = Array.from(
  expenses.reduce((map, expense) => {
    map.set(expense.category, Math.round(((map.get(expense.category) ?? 0) + expense.amount) * 100) / 100);
    return map;
  }, new Map<string, number>()),
)
  .map(([category, amount]) => ({ category, amount }))
  .sort((a, b) => b.amount - a.amount);

export const inventoryDistribution = inventoryByCategory.slice(0, 7);

export const dashboardKpis = {
  revenue: 186420950.4,
  revenueChange: 12.4,
  orders: orders.length,
  ordersChange: 8.1,
  customers: customers.filter((customer) => customer.status === "Active").length,
  customersChange: 4.6,
  inventoryValue: inventorySummary.totalValue,
  inventoryChange: -2.8,
  purchaseOrders: purchaseOrders.filter((order) => !["Received", "Cancelled"].includes(order.status)).length,
  purchaseOrdersChange: 6.2,
  outstandingInvoices: Math.round(invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0) * 100) / 100,
  outstandingChange: -5.4,
  operatingExpenses: financeSummary.operatingExpenses,
  expensesChange: 3.1,
  netProfit: financeSummary.netProfit,
  netProfitChange: 9.7,
};

export const topProducts = [...products]
  .map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    revenue: product.monthlySales.reduce((sum, entry) => sum + entry.revenue, 0),
    units: product.monthlySales.reduce((sum, entry) => sum + entry.units, 0),
  }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 8);

export const topCustomers = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 8);

export const recentOrders = [...orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate)).slice(0, 8);

export const outstandingInvoiceList = invoices
  .filter((invoice) => invoice.balanceDue > 0 && invoice.status !== "Cancelled")
  .sort((a, b) => b.balanceDue - a.balanceDue)
  .slice(0, 8);

export const pendingPurchaseOrders = purchaseOrders
  .filter((order) => order.status === "Pending Approval" || order.status === "Sent" || order.status === "Approved")
  .slice(0, 8);

export const dashboardLowStock = lowStockItems.slice(0, 8);

export const operationsSnapshot = {
  fulfilmentRate: 96.2,
  onTimeDelivery: logisticsSummary.onTimeRate,
  openProjects: projectSummary.active,
  atRiskProjects: projectSummary.atRisk,
  warehouseUtilisation: 76.4,
  averageOrderValue: Math.round((orders.reduce((sum, order) => sum + order.total, 0) / orders.length) * 100) / 100,
};
