import type { ReactNode } from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly breadcrumbs?: Crumb[];
  readonly actions?: ReactNode;
  readonly meta?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions, meta }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 print:gap-1">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="print:hidden">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem key={`${crumb.label}-${crumb.href ?? index}`}>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link prefetch={false} href={crumb.href}>
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate font-semibold text-xl tracking-tight md:text-2xl">{title}</h1>
          {description && <p className="max-w-3xl text-muted-foreground text-sm">{description}</p>}
          {meta}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 print:hidden">{actions}</div>}
      </div>
    </div>
  );
}
