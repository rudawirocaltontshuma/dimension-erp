import type {
  GoodsReceipt,
  GoodsReceiptStatus,
  LineItem,
  Priority,
  PurchaseOrder,
  PurchaseOrderStatus,
  PurchaseRequest,
  PurchaseRequestStatus,
  SupplierInvoice,
  SupplierInvoiceStatus,
  TimelineEvent,
} from "@/types/erp";

import { warehouses } from "./organisation";
import { products } from "./products";
import {
  createRng,
  intBetween,
  isoDate,
  isoDateTime,
  moneyBetween,
  personName,
  pick,
  type Rng,
  weighted,
} from "./random";
import { suppliers } from "./suppliers";

const BUYERS = ["Kagiso Mokoena", "Anthea Jacobs", "Warrick Meyer", "Palesa Mahlangu", "Duncan Louw"];
const DEPARTMENTS = [
  "Operations",
  "Finance",
  "Sales",
  "Human Resources",
  "Information Technology",
  "Marketing",
  "Procurement",
];
const SPEND_CATEGORIES = [
  "Raw Materials",
  "Packaging",
  "Electrical Components",
  "Industrial Hardware",
  "Logistics Services",
  "IT & Equipment",
  "Facilities & Maintenance",
  "Professional Services",
];

function buildPoItems(rng: Rng, count: number, prefix: string): LineItem[] {
  return Array.from({ length: count }, (_, index) => {
    const product = products[intBetween(rng, 0, products.length - 1)];
    const quantity = intBetween(rng, 10, 240);
    const lineTotal = Math.round(product.cost * quantity * 100) / 100;
    return {
      id: `${prefix}-L${index + 1}`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPrice: product.cost,
      discountPercent: 0,
      taxPercent: 15,
      lineTotal,
    };
  });
}

function poTimeline(reference: string, status: PurchaseOrderStatus, buyer: string): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${reference}-p1`,
      title: "Purchase order raised",
      description: `${reference} raised from an approved purchase request.`,
      timestamp: isoDateTime(-240),
      actor: buyer,
      tone: "info",
    },
  ];
  if (status !== "Draft") {
    events.push({
      id: `${reference}-p2`,
      title: "Approved by procurement lead",
      description: "Commercial terms and budget availability confirmed.",
      timestamp: isoDateTime(-216),
      actor: "Procurement Governance",
      tone: "success",
    });
  }
  if (["Sent", "Partially Received", "Received"].includes(status)) {
    events.push({
      id: `${reference}-p3`,
      title: "Order transmitted to supplier",
      description: "Supplier acknowledged the order and confirmed the delivery window.",
      timestamp: isoDateTime(-180),
      actor: "Supplier Portal",
      tone: "info",
    });
  }
  if (status === "Partially Received") {
    events.push({
      id: `${reference}-p4`,
      title: "Partial goods receipt",
      description: "First consignment booked in at the receiving warehouse.",
      timestamp: isoDateTime(-72),
      actor: "Receiving Team",
      tone: "warning",
    });
  }
  if (status === "Received") {
    events.push({
      id: `${reference}-p5`,
      title: "Goods received in full",
      description: "All ordered quantities booked in and matched to the supplier invoice.",
      timestamp: isoDateTime(-40),
      actor: "Receiving Team",
      tone: "success",
    });
  }
  if (status === "Cancelled") {
    events.push({
      id: `${reference}-p6`,
      title: "Order cancelled",
      description: "Cancelled after the supplier confirmed an extended lead time.",
      timestamp: isoDateTime(-60),
      actor: buyer,
      tone: "danger",
    });
  }
  return events;
}

function buildPurchaseOrders(): PurchaseOrder[] {
  const rng = createRng(20260222);

  return Array.from({ length: 48 }, (_, index) => {
    const supplier = suppliers[index % suppliers.length];
    const warehouse = warehouses[index % warehouses.length];
    const reference = `PO-${7300 + index}`;
    const items = buildPoItems(rng, intBetween(rng, 1, 5), reference);
    const subtotal = Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const status = weighted<PurchaseOrderStatus>(rng, [
      ["Received", 28],
      ["Sent", 20],
      ["Approved", 16],
      ["Partially Received", 14],
      ["Pending Approval", 12],
      ["Draft", 5],
      ["Cancelled", 5],
    ]);
    const buyer = BUYERS[index % BUYERS.length];
    const orderDay = -intBetween(rng, 1, 200);

    return {
      id: reference,
      reference,
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate: isoDate(orderDay),
      expectedDate: isoDate(orderDay + supplier.leadTimeDays),
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      buyer,
      currency: supplier.currency,
      status,
      items,
      subtotal,
      tax,
      total: Math.round((subtotal + tax) * 100) / 100,
      category: SPEND_CATEGORIES[index % SPEND_CATEGORIES.length],
      timeline: poTimeline(reference, status, buyer),
    };
  });
}

export const purchaseOrders: PurchaseOrder[] = buildPurchaseOrders();
export const purchaseOrderById = (id: string) => purchaseOrders.find((order) => order.id === id);

function buildPurchaseRequests(): PurchaseRequest[] {
  const rng = createRng(20260305);
  const justifications = [
    "Replenishment of fast moving stock ahead of the winter trading period.",
    "Replacement of end of life workshop equipment flagged during the safety audit.",
    "Consumables required to support the scheduled plant maintenance shutdown.",
    "Additional packaging stock for the increased distribution volumes.",
    "Project related materials for the approved capital works programme.",
  ];

  return Array.from({ length: 34 }, (_, index) => {
    const requestDay = -intBetween(rng, 1, 150);
    return {
      id: `PR-${4200 + index}`,
      reference: `PR-${4200 + index}`,
      requester: personName(rng),
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      requestDate: isoDate(requestDay),
      requiredDate: isoDate(requestDay + intBetween(rng, 7, 45)),
      itemCount: intBetween(rng, 1, 12),
      estimatedAmount: Math.round(moneyBetween(rng, 12400, 1840000) * 100) / 100,
      currency: "ZAR",
      priority: weighted<Priority>(rng, [
        ["Medium", 40],
        ["High", 26],
        ["Low", 22],
        ["Critical", 12],
      ]),
      status: weighted<PurchaseRequestStatus>(rng, [
        ["Approved", 34],
        ["Submitted", 22],
        ["Under Review", 20],
        ["Draft", 12],
        ["Rejected", 12],
      ]),
      justification: pick(rng, justifications),
    };
  });
}

export const purchaseRequests: PurchaseRequest[] = buildPurchaseRequests();

function buildGoodsReceipts(): GoodsReceipt[] {
  const rng = createRng(20260410);

  return Array.from({ length: 36 }, (_, index) => {
    const po = purchaseOrders[(index * 2) % purchaseOrders.length];
    const ordered = intBetween(rng, 40, 620);
    const status = weighted<GoodsReceiptStatus>(rng, [
      ["Completed", 56],
      ["Partially Received", 22],
      ["Pending Inspection", 16],
      ["Rejected", 6],
    ]);
    const received = status === "Completed" ? ordered : Math.round(ordered * moneyBetween(rng, 0.3, 0.92));

    return {
      id: `GRN-${6100 + index}`,
      reference: `GRN-${6100 + index}`,
      purchaseOrderRef: po.reference,
      supplierName: po.supplierName,
      warehouseName: po.warehouseName,
      receivedDate: isoDate(-intBetween(rng, 1, 120)),
      receivedBy: personName(rng),
      itemCount: po.items.length,
      quantityReceived: received,
      quantityOrdered: ordered,
      status,
    };
  });
}

export const goodsReceipts: GoodsReceipt[] = buildGoodsReceipts();

function buildSupplierInvoices(): SupplierInvoice[] {
  const rng = createRng(20260519);

  return Array.from({ length: 42 }, (_, index) => {
    const po = purchaseOrders[(index * 3) % purchaseOrders.length];
    const status = weighted<SupplierInvoiceStatus>(rng, [
      ["Paid", 34],
      ["Approved", 18],
      ["Awaiting Approval", 16],
      ["Scheduled", 14],
      ["Overdue", 12],
      ["Disputed", 6],
    ]);
    const amount = po.total;
    const invoiceDay = -intBetween(rng, 2, 160);

    return {
      id: `SINV-${9200 + index}`,
      reference: `SINV-${9200 + index}`,
      supplierName: po.supplierName,
      purchaseOrderRef: po.reference,
      invoiceDate: isoDate(invoiceDay),
      dueDate: isoDate(invoiceDay + 30),
      currency: po.currency,
      amount,
      amountPaid: status === "Paid" ? amount : Math.round(amount * moneyBetween(rng, 0, 0.4) * 100) / 100,
      status,
    };
  });
}

export const supplierInvoices: SupplierInvoice[] = buildSupplierInvoices();

export const procurementDepartments = DEPARTMENTS;
export const spendCategories = SPEND_CATEGORIES;
export const buyers = BUYERS;
