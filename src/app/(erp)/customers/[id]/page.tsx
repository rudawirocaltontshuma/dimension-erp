import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { EmptyState } from "@/components/erp/states";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customers } from "@/data/erp/customers";
import { invoices, orders, payments } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

const TABS = ["Overview", "Orders", "Invoices", "Payments", "Contacts", "Addresses", "Activity"];

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find((entry) => entry.id === id);
  if (!customer) notFound();

  const customerOrders = orders.filter((order) => order.customerId === customer.id);
  const customerInvoices = invoices.filter((invoice) => invoice.customerId === customer.id);
  const customerPayments = payments.filter((payment) => payment.party === customer.tradingName);

  const monthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    month,
    revenue: Math.round((customer.totalRevenue / 12) * (0.72 + ((index * 7) % 9) / 12)),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.tradingName}
        description={`${customer.name} · ${customer.segment} account managed by ${customer.accountManager}`}
        breadcrumbs={[
          { label: "Operations", href: "/dashboard" },
          { label: "Customers", href: "/customers" },
          { label: customer.id },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={customer.status} />
            <span className="text-muted-foreground text-xs">Customer since {formatDate(customer.customerSince)}</span>
          </div>
        }
        actions={
          <>
            <PrintButton label="Print summary" />
            <DemoActionButton
              size="sm"
              message="Demo changes applied."
              description={`A statement preview was prepared for ${customer.tradingName}.`}
            >
              Send statement
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={formatMoney(customer.totalRevenue, customer.currency)}
          hint="Lifetime trading value"
        />
        <KpiCard
          label="Orders"
          value={formatNumber(customer.totalOrders)}
          hint={`Last order ${formatDate(customer.lastOrderDate)}`}
        />
        <KpiCard
          label="Average order value"
          value={formatMoney(customer.averageOrderValue, customer.currency)}
          hint="Across all channels"
        />
        <KpiCard
          label="Outstanding balance"
          value={formatMoney(customer.outstandingBalance, customer.currency)}
          hint={`Credit limit ${formatMoney(customer.creditLimit)}`}
        />
      </section>

      <Tabs defaultValue="Overview" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="Overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Account details" className="lg:col-span-2">
              <InfoGrid
                columns={3}
                items={[
                  { label: "Registered name", value: customer.name },
                  { label: "Account number", value: customer.id },
                  { label: "Segment", value: customer.segment },
                  { label: "Industry", value: customer.industry },
                  { label: "VAT number", value: customer.vatNumber },
                  { label: "Payment terms", value: customer.paymentTerms },
                  { label: "Email", value: customer.email },
                  { label: "Telephone", value: customer.phone },
                  { label: "Website", value: customer.website },
                  { label: "Currency", value: customer.currency },
                  { label: "Credit limit", value: formatMoney(customer.creditLimit) },
                  { label: "Account manager", value: customer.accountManager },
                ]}
              />
            </SectionCard>
            <SectionCard title="Trading summary">
              <div className="space-y-1">
                <StatRow label="Lifetime revenue" value={formatMoney(customer.totalRevenue, customer.currency)} />
                <StatRow label="Orders placed" value={formatNumber(customer.totalOrders)} />
                <StatRow
                  label="Average order value"
                  value={formatMoney(customer.averageOrderValue, customer.currency)}
                />
                <StatRow
                  label="Open invoices"
                  value={formatNumber(customerInvoices.filter((invoice) => invoice.balanceDue > 0).length)}
                />
                <StatRow label="Customer since" value={formatDate(customer.customerSince)} />
                <StatRow label="Last order" value={formatDate(customer.lastOrderDate)} />
              </div>
            </SectionCard>
          </div>
          <ChartCard title="Revenue trend" description="Indicative monthly revenue for the current financial year.">
            <ErpBarChart
              data={monthly}
              xKey="month"
              money
              series={[{ key: "revenue", label: "Revenue" }]}
              height={240}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="Orders">
          <SectionCard title="Orders" description={`${customerOrders.length} orders linked to this account.`}>
            {customerOrders.length === 0 ? (
              <EmptyState
                title="No orders recorded"
                description="This demonstration account has no orders in the current dataset."
              />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            prefetch={false}
                            href={`/orders/${order.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {order.reference}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="text-muted-foreground">{order.channel}</TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatMoney(order.total, order.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Invoices">
          <SectionCard
            title="Invoices"
            description={`${customerInvoices.length} invoices raised against this account.`}
          >
            {customerInvoices.length === 0 ? (
              <EmptyState
                title="No invoices raised"
                description="Invoices generated for this account will appear here."
              />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Link
                            prefetch={false}
                            href={`/invoices/${invoice.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {invoice.reference}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(invoice.issueDate)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatMoney(invoice.total, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatMoney(invoice.balanceDue, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Payments">
          <SectionCard title="Payments" description="Receipts allocated to this customer account.">
            {customerPayments.length === 0 ? (
              <EmptyState
                title="No payments allocated"
                description="Receipts matched to this account will be listed here."
              />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.reference}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(payment.date)}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.documentRef}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatMoney(payment.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Contacts">
          <SectionCard title="Contacts" description="People registered against this trading account.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customer.contacts.map((contact) => (
                <div key={contact.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{contact.name}</p>
                    {contact.primary && <StatusBadge status="Primary" tone="info" />}
                  </div>
                  <p className="text-muted-foreground text-sm">{contact.role}</p>
                  <p className="mt-2 text-sm">{contact.email}</p>
                  <p className="text-muted-foreground text-sm">{contact.phone}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Addresses">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Billing address">
              <address className="space-y-0.5 text-sm not-italic">
                <p>{customer.billingAddress.line1}</p>
                {customer.billingAddress.line2 && <p>{customer.billingAddress.line2}</p>}
                <p>
                  {customer.billingAddress.city}, {customer.billingAddress.province}{" "}
                  {customer.billingAddress.postalCode}
                </p>
                <p>{customer.billingAddress.country}</p>
              </address>
            </SectionCard>
            <SectionCard title="Delivery address">
              <address className="space-y-0.5 text-sm not-italic">
                <p>{customer.shippingAddress.line1}</p>
                {customer.shippingAddress.line2 && <p>{customer.shippingAddress.line2}</p>}
                <p>
                  {customer.shippingAddress.city}, {customer.shippingAddress.province}{" "}
                  {customer.shippingAddress.postalCode}
                </p>
                <p>{customer.shippingAddress.country}</p>
              </address>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="Activity">
          <SectionCard title="Account activity" description="Recent events recorded against this customer.">
            <ActivityTimeline
              events={[
                {
                  id: `${customer.id}-a1`,
                  title: "Credit review completed",
                  description: `Credit limit confirmed at ${formatMoney(customer.creditLimit)} with ${customer.paymentTerms} terms.`,
                  timestamp: "2026-06-18T09:20:00.000Z",
                  actor: "Credit Control",
                  tone: "success",
                },
                {
                  id: `${customer.id}-a2`,
                  title: "Order captured",
                  description: `Most recent order captured on ${formatDate(customer.lastOrderDate)}.`,
                  timestamp: "2026-06-14T11:05:00.000Z",
                  actor: customer.accountManager,
                  tone: "info",
                },
                {
                  id: `${customer.id}-a3`,
                  title: "Statement issued",
                  description: "Monthly statement delivered to the registered accounts mailbox.",
                  timestamp: "2026-06-01T07:45:00.000Z",
                  actor: "Accounts Receivable",
                  tone: "neutral",
                },
                {
                  id: `${customer.id}-a4`,
                  title: "Account onboarded",
                  description: `Trading account activated on ${formatDate(customer.customerSince)}.`,
                  timestamp: "2026-05-02T08:00:00.000Z",
                  actor: "Sales Administration",
                  tone: "success",
                },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
