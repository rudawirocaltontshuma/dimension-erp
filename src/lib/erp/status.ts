import type { StatusTone } from "@/types/erp";

const TONE_BY_STATUS: Record<string, StatusTone> = {
  // Generic
  Active: "success",
  Inactive: "neutral",
  Completed: "success",
  Complete: "success",
  Cancelled: "danger",
  Draft: "neutral",
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Posted: "success",
  Reversed: "danger",
  Void: "danger",
  Reconciled: "info",
  Operational: "success",
  "Limited Capacity": "warning",
  Maintenance: "warning",
  // Orders
  Processing: "info",
  Unpaid: "danger",
  "Partially Paid": "warning",
  Paid: "success",
  Refunded: "neutral",
  Unfulfilled: "neutral",
  Picking: "info",
  Packed: "info",
  Shipped: "info",
  Delivered: "success",
  // Quotes
  Sent: "info",
  Viewed: "info",
  Accepted: "success",
  Expired: "neutral",
  // Invoices
  Overdue: "danger",
  // Customers / suppliers
  "On Hold": "warning",
  Prospect: "info",
  "Under Review": "warning",
  Suspended: "danger",
  // Products / stock
  "Low Stock": "warning",
  "Out of Stock": "danger",
  Discontinued: "neutral",
  "In Stock": "success",
  Overstocked: "info",
  // Procurement
  "Pending Approval": "warning",
  "Partially Received": "warning",
  Received: "success",
  Submitted: "info",
  "Pending Inspection": "warning",
  "Awaiting Approval": "warning",
  Scheduled: "info",
  Disputed: "danger",
  // Inventory transfers
  Requested: "info",
  "In Transit": "info",
  // HR
  "On Leave": "warning",
  Present: "success",
  Late: "warning",
  Absent: "danger",
  Remote: "info",
  Outstanding: "success",
  Exceeds: "success",
  Meets: "info",
  "Needs Improvement": "warning",
  "In Progress": "info",
  Reimbursed: "success",
  // Projects
  Planning: "info",
  "At Risk": "danger",
  Backlog: "neutral",
  Todo: "neutral",
  Review: "warning",
  Done: "success",
  Recorded: "neutral",
  Invoiced: "info",
  // Logistics
  Preparing: "neutral",
  "Out for Delivery": "info",
  Delayed: "danger",
  Available: "success",
  Failed: "danger",
  Rescheduled: "warning",
  Planned: "info",
  Cleared: "success",
  // Priority
  Low: "neutral",
  Medium: "info",
  High: "warning",
  Critical: "danger",
};

export function toneForStatus(status: string): StatusTone {
  return TONE_BY_STATUS[status] ?? "neutral";
}
