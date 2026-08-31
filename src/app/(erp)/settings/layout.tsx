import type { ReactNode } from "react";

import { PageHeader } from "@/components/erp/page-header";

import { SettingsNav } from "./_components/settings-nav";

export default function SettingsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Company, structure, financial and system configuration for the Dimension ERP demonstration."
        breadcrumbs={[{ label: "Administration", href: "/settings" }, { label: "Settings" }]}
      />
      <SettingsNav />
      {children}
    </div>
  );
}
