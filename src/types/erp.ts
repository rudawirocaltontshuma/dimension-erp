export type CurrencyCode = "ZAR" | "USD" | "EUR" | "GBP";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  primary: boolean;
}

export type CustomerSegment = "Enterprise" | "Wholesale" | "Retail" | "Government" | "Reseller";
export type CustomerStatus = "Active" | "On Hold" | "Prospect" | "Inactive";

export interface Customer {
  id: string;
  name: string;
  tradingName: string;
  segment: CustomerSegment;
  status: CustomerStatus;
  industry: string;
  email: string;
  phone: string;
  website: string;
  vatNumber: string;
  currency: CurrencyCode;
  creditLimit: number;
  outstandingBalance: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerSince: string;
  lastOrderDate: string;
  accountManager: string;
  paymentTerms: string;
  billingAddress: Address;
  shippingAddress: Address;
  contacts: Contact[];
  tags: string[];
}

export type ProductStatus = "Active" | "Low Stock" | "Out of Stock" | "Discontinued";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  supplierId: string;
  supplierName: string;
  unit: string;
  price: number;
  cost: number;
  margin: number;
  taxRate: number;
  stockOnHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  leadTimeDays: number;
  barcode: string;
  weightKg: number;
  status: ProductStatus;
  createdAt: string;
  monthlySales: { month: string; units: number; revenue: number }[];
}

export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Partially Paid" | "Paid" | "Refunded";
export type FulfillmentStatus = "Unfulfilled" | "Picking" | "Packed" | "Shipped" | "Delivered";
export type SalesChannel = "Direct Sales" | "Field Sales" | "Online Portal" | "Distributor" | "Tender";

export interface LineItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  lineTotal: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  tone: StatusTone;
}

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  requiredDate: string;
  channel: SalesChannel;
  salesRep: string;
  warehouseId: string;
  warehouseName: string;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  billingAddress: Address;
  shippingAddress: Address;
  notes: string;
  timeline: TimelineEvent[];
}

export type InvoiceStatus = "Draft" | "Sent" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";

export interface Invoice {
  id: string;
  reference: string;
  orderId: string | null;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  status: InvoiceStatus;
  items: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes: string;
  billingAddress: Address;
  timeline: TimelineEvent[];
}

export type QuoteStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected" | "Expired";

export interface Quote {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  createdDate: string;
  expiryDate: string;
  salesRep: string;
  currency: CurrencyCode;
  status: QuoteStatus;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  probability: number;
  notes: string;
}

export type SupplierStatus = "Active" | "Under Review" | "Suspended" | "Inactive";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  currency: CurrencyCode;
  paymentTerms: string;
  leadTimeDays: number;
  totalOrders: number;
  totalSpend: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  status: SupplierStatus;
  onboardedAt: string;
  vatNumber: string;
  address: Address;
}

export type PurchaseRequestStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface PurchaseRequest {
  id: string;
  reference: string;
  requester: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  itemCount: number;
  estimatedAmount: number;
  currency: CurrencyCode;
  priority: Priority;
  status: PurchaseRequestStatus;
  justification: string;
}

export type PurchaseOrderStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Sent"
  | "Partially Received"
  | "Received"
  | "Cancelled";

export interface PurchaseOrder {
  id: string;
  reference: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  warehouseId: string;
  warehouseName: string;
  buyer: string;
  currency: CurrencyCode;
  status: PurchaseOrderStatus;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  category: string;
  timeline: TimelineEvent[];
}

export type GoodsReceiptStatus = "Pending Inspection" | "Partially Received" | "Completed" | "Rejected";

export interface GoodsReceipt {
  id: string;
  reference: string;
  purchaseOrderRef: string;
  supplierName: string;
  warehouseName: string;
  receivedDate: string;
  receivedBy: string;
  itemCount: number;
  quantityReceived: number;
  quantityOrdered: number;
  status: GoodsReceiptStatus;
}

export type SupplierInvoiceStatus = "Awaiting Approval" | "Approved" | "Scheduled" | "Paid" | "Disputed" | "Overdue";

export interface SupplierInvoice {
  id: string;
  reference: string;
  supplierName: string;
  purchaseOrderRef: string;
  invoiceDate: string;
  dueDate: string;
  currency: CurrencyCode;
  amount: number;
  amountPaid: number;
  status: SupplierInvoiceStatus;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  manager: string;
  phone: string;
  capacityPallets: number;
  usedPallets: number;
  utilization: number;
  productCount: number;
  stockValue: number;
  inboundThisWeek: number;
  outboundThisWeek: number;
  lowStockItems: number;
  status: "Operational" | "Limited Capacity" | "Maintenance";
  address: Address;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Overstocked";

export interface InventoryRecord {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  unitCost: number;
  stockValue: number;
  binLocation: string;
  lastCountedAt: string;
  status: StockStatus;
}

export type StockMovementType = "Receipt" | "Shipment" | "Transfer" | "Adjustment" | "Return";

export interface StockMovement {
  id: string;
  reference: string;
  date: string;
  productSku: string;
  productName: string;
  warehouseName: string;
  quantity: number;
  type: StockMovementType;
  status: "Draft" | "Posted" | "Reversed";
  performedBy: string;
  sourceDocument: string;
}

export type TransferStatus = "Draft" | "Requested" | "Approved" | "In Transit" | "Completed";

export interface StockTransfer {
  id: string;
  reference: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  requestedDate: string;
  expectedDate: string;
  itemCount: number;
  totalQuantity: number;
  requestedBy: string;
  status: TransferStatus;
}

export type AdjustmentReason = "Cycle Count" | "Damage" | "Expiry" | "Shrinkage" | "Reclassification" | "Found Stock";

export interface StockAdjustment {
  id: string;
  reference: string;
  date: string;
  warehouseName: string;
  productSku: string;
  productName: string;
  quantityDelta: number;
  valueDelta: number;
  reason: AdjustmentReason;
  approvedBy: string;
  status: "Draft" | "Approved" | "Posted";
}

export type AccountType = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subType: string;
  balance: number;
  currency: CurrencyCode;
  status: "Active" | "Inactive";
  parentCode?: string;
}

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  description: string;
  category: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: CurrencyCode;
  status: "Posted" | "Pending" | "Reconciled" | "Void";
  source: string;
}

export type ExpenseStatus = "Draft" | "Submitted" | "Approved" | "Reimbursed" | "Rejected";

export interface Expense {
  id: string;
  reference: string;
  date: string;
  category: string;
  department: string;
  employee: string;
  description: string;
  amount: number;
  tax: number;
  currency: CurrencyCode;
  status: ExpenseStatus;
  paymentMethod: string;
}

export type PaymentMethod = "Bank Transfer" | "Card" | "Cash" | "Electronic Transfer" | "Debit Order";

export interface Payment {
  id: string;
  reference: string;
  date: string;
  party: string;
  partyType: "Customer" | "Supplier";
  documentRef: string;
  amount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  status: "Cleared" | "Pending" | "Failed" | "Reversed";
  account: string;
}

export type EmployeeStatus = "Active" | "On Leave" | "Inactive";

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  location: string;
  manager: string;
  employmentType: "Permanent" | "Contract" | "Part-Time" | "Intern";
  status: EmployeeStatus;
  hireDate: string;
  salary: number;
  currency: CurrencyCode;
  leaveBalance: number;
  performanceScore: number;
  attendanceRate: number;
  idNumber: string;
  address: Address;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  headcount: number;
  openPositions: number;
  annualBudget: number;
  spentToDate: number;
  performanceScore: number;
  location: string;
  costCentre: string;
}

export type AttendanceStatus = "Present" | "Late" | "Absent" | "Remote";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: AttendanceStatus;
}

export type LeaveType = "Annual" | "Sick" | "Personal" | "Family Responsibility" | "Study";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  approver: string;
  reason: string;
}

export interface PayrollRun {
  id: string;
  period: string;
  employees: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "Draft" | "Processed" | "Paid";
  payDate: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  reviewer: string;
  score: number;
  rating: "Outstanding" | "Exceeds" | "Meets" | "Needs Improvement";
  status: "Scheduled" | "In Progress" | "Completed";
  reviewDate: string;
}

export type ProjectStatus = "Planning" | "Active" | "At Risk" | "Completed" | "On Hold";

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  manager: string;
  department: string;
  startDate: string;
  deadline: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  currency: CurrencyCode;
  team: string[];
  description: string;
  milestones: { id: string; name: string; dueDate: string; status: "Pending" | "In Progress" | "Complete" }[];
}

export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "Review" | "Done";

export interface ProjectTask {
  id: string;
  reference: string;
  title: string;
  projectId: string;
  projectName: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  estimateHours: number;
  loggedHours: number;
  tags: string[];
}

export interface ProjectCost {
  id: string;
  reference: string;
  projectId: string;
  projectName: string;
  date: string;
  category: "Labour" | "Materials" | "Subcontractor" | "Travel" | "Equipment" | "Software";
  description: string;
  amount: number;
  currency: CurrencyCode;
  status: "Recorded" | "Approved" | "Invoiced";
}

export type ShipmentStatus = "Preparing" | "In Transit" | "Out for Delivery" | "Delivered" | "Delayed";

export interface Shipment {
  id: string;
  reference: string;
  orderRef: string;
  customerName: string;
  origin: string;
  destination: string;
  carrier: string;
  driver: string;
  vehicleId: string;
  dispatchDate: string;
  expectedDelivery: string;
  weightKg: number;
  packages: number;
  status: ShipmentStatus;
  serviceLevel: "Standard" | "Express" | "Overnight" | "Economy";
  timeline: TimelineEvent[];
}

export interface Delivery {
  id: string;
  reference: string;
  shipmentRef: string;
  customerName: string;
  address: string;
  region: string;
  scheduledDate: string;
  timeWindow: string;
  driver: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Failed" | "Rescheduled";
  proofOfDelivery: string;
}

export interface DeliveryRoute {
  id: string;
  code: string;
  name: string;
  region: string;
  driver: string;
  vehicleId: string;
  stops: number;
  distanceKm: number;
  estimatedHours: number;
  status: "Planned" | "Active" | "Completed" | "Cancelled";
  departureTime: string;
}

export type VehicleStatus = "Available" | "In Transit" | "Maintenance" | "Inactive";

export interface Vehicle {
  id: string;
  registration: string;
  type: "Panel Van" | "Rigid Truck" | "Refrigerated Truck" | "Bakkie" | "Interlink";
  make: string;
  model: string;
  driver: string;
  currentLocation: string;
  mileageKm: number;
  capacityKg: number;
  lastServiceDate: string;
  nextServiceKm: number;
  status: VehicleStatus;
}

export type NotificationCategory = "Inventory" | "Procurement" | "Finance" | "Logistics" | "Projects" | "HR" | "System";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  tone: StatusTone;
  timestamp: string;
  read: boolean;
  href: string;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  module: string;
  timestamp: string;
  tone: StatusTone;
}

export interface ReportDefinition {
  id: string;
  name: string;
  category: "Sales" | "Finance" | "Inventory" | "Procurement" | "HR" | "Projects" | "Operations" | "Logistics";
  description: string;
  type: "Summary" | "Detailed" | "Statement" | "Analytical" | "Register";
  lastUpdated: string;
  href: string;
  owner: string;
}
