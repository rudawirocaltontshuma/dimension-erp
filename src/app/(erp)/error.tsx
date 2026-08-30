"use client";

import Link from "next/link";

import { ErrorState } from "@/components/erp/states";
import { Button } from "@/components/ui/button";

export default function ErpError({ reset }: { readonly error: Error; readonly reset: () => void }) {
  return (
    <div className="space-y-4">
      <ErrorState
        title="Something went wrong"
        description="This screen could not be prepared from the demonstration dataset. Try again, or return to the enterprise overview."
        onRetry={reset}
      />
      <div className="flex justify-center">
        <Button asChild variant="ghost" size="sm">
          <Link prefetch={false} href="/dashboard">
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
