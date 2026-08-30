"use client";

import { ClipboardCheck, ClipboardList, Plus, ShieldAlert } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { procurementDepartments, purchaseRequests } from "@/data/erp/procurement";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { PurchaseRequest } from "@/types/erp";

const specs: ColumnSpec<PurchaseRequest>[] = [
  { id: "reference", header: "Request", kind: "strong", value: (row) => row.reference },
  { id: "requester", header: "Requester", value: (row) => row.requester },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "requestDate", header: "Raised", kind: "date", value: (row) => row.requestDate },
  { id: "requiredDate", header: "Required", kind: "date", value: (row) => row.requiredDate },
  { id: "items", header: "Items", kind: "number", align: "right", value: (row) => row.itemCount },
  { id: "amount", header: "Estimated", kind: "money", align: "right", value: (row) => row.estimatedAmount },
  { id: "priority", header: "Priority", kind: "status", value: (row) => row.priority },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function PurchaseRequestsPage() {
  const approved = purchaseRequests.filter((request) => request.status === "Approved");
  const pending = purchaseRequests.filter(
    (request) => request.status === "Submitted" || request.status === "Under Review",
  );
  const critical = purchaseRequests.filter((request) => request.priority === "Critical");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Requests"
        description="Internal requisitions raised by departments before conversion into purchase orders."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Purchase Requests" }]}
        actions={
          <DemoFormDialog
            title="New purchase request"
            description="Raise a demonstration requisition for approval."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New request
              </Button>
            }
            fields={[
              { name: "requester", label: "Requester", required: true },
              {
                name: "department",
                label: "Department",
                type: "select",
                required: true,
                options: procurementDepartments,
              },
              { name: "requiredDate", label: "Required date", type: "date", required: true },
              { name: "amount", label: "Estimated amount (ZAR)", type: "number", required: true },
              { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
              { name: "justification", label: "Justification", type: "textarea", required: true },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Requests"
          value={formatNumber(purchaseRequests.length)}
          hint="All departments"
          icon={ClipboardList}
        />
        <KpiCard
          label="Awaiting approval"
          value={formatNumber(pending.length)}
          hint="Submitted or under review"
          icon={ClipboardCheck}
        />
        <KpiCard
          label="Approved value"
          value={formatMoney(approved.reduce((sum, request) => sum + request.estimatedAmount, 0))}
          hint={`${approved.length} approved requests`}
          icon={ClipboardCheck}
        />
        <KpiCard
          label="Critical priority"
          value={formatNumber(critical.length)}
          hint="Escalated requisitions"
          icon={ShieldAlert}
        />
      </section>

      <SectionCard title="Requisition register">
        <DataTable
          data={purchaseRequests}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.requester} ${row.department} ${row.justification}`}
          searchPlaceholder="Search requests or requesters"
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(purchaseRequests, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "department",
              label: "Department",
              options: uniqueValues(purchaseRequests, (row) => row.department),
              getValue: (row) => row.department,
            },
            {
              id: "priority",
              label: "Priority",
              options: uniqueValues(purchaseRequests, (row) => row.priority),
              getValue: (row) => row.priority,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
