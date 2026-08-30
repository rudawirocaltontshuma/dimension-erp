"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { StatusBadge } from "@/components/erp/status-badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notifications } from "@/data/erp/notifications";
import { formatRelative } from "@/lib/erp/format";

const RULES = [
  {
    id: "lowStock",
    module: "Inventory",
    event: "Stock falls below the reorder level",
    recipients: "Warehouse managers",
  },
  { id: "outOfStock", module: "Inventory", event: "Stock reaches zero on hand", recipients: "Supply chain team" },
  {
    id: "poApproval",
    module: "Procurement",
    event: "Purchase order requires approval",
    recipients: "Procurement governance",
  },
  {
    id: "grnVariance",
    module: "Procurement",
    event: "Goods receipt quantity variance",
    recipients: "Receiving supervisors",
  },
  { id: "invoiceOverdue", module: "Finance", event: "Customer invoice becomes overdue", recipients: "Credit control" },
  { id: "paymentCleared", module: "Finance", event: "Customer payment clears", recipients: "Accounts receivable" },
  {
    id: "deliveryDelay",
    module: "Logistics",
    event: "Delivery is reported as delayed",
    recipients: "Logistics control",
  },
  { id: "projectRisk", module: "Projects", event: "Project moves to At Risk", recipients: "Project office" },
  { id: "leaveRequest", module: "HR", event: "Leave request is submitted", recipients: "Line managers" },
];

export default function NotificationSettingsPage() {
  const [channels, setChannels] = useState<Record<string, { inApp: boolean; email: boolean }>>(() =>
    Object.fromEntries(RULES.map((rule, index) => [rule.id, { inApp: true, email: index % 3 !== 2 }])),
  );

  const toggle = (id: string, channel: "inApp" | "email", value: boolean, label: string) => {
    setChannels((current) => ({ ...current, [id]: { ...current[id], [channel]: value } }));
    toast.success("Demo changes applied.", {
      description: `${label} ${channel === "inApp" ? "in-app" : "email"} alerts ${value ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Notification rules" description="Alert routing across modules and channels.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>In-app</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RULES.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <StatusBadge status={rule.module} tone="info" />
                  </TableCell>
                  <TableCell className="font-medium">{rule.event}</TableCell>
                  <TableCell className="text-muted-foreground">{rule.recipients}</TableCell>
                  <TableCell>
                    <Switch
                      checked={channels[rule.id].inApp}
                      aria-label={`${rule.event} in-app alerts`}
                      onCheckedChange={(checked) => toggle(rule.id, "inApp", checked, rule.event)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={channels[rule.id].email}
                      aria-label={`${rule.event} email alerts`}
                      onCheckedChange={(checked) => toggle(rule.id, "email", checked, rule.event)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-muted-foreground text-xs">
          No email or messaging provider is connected. Alerts are demonstrated inside the notification centre only.
        </p>
      </SectionCard>

      <SectionCard
        title="Recent notifications"
        description="The most recent alerts raised in the demonstration dataset."
      >
        <ul className="divide-y">
          {notifications.slice(0, 8).map((notification) => (
            <li key={notification.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-muted-foreground text-sm">{notification.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={notification.category} tone={notification.tone} />
                <span className="text-muted-foreground text-xs">{formatRelative(notification.timestamp)}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
