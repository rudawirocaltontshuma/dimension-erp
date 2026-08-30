import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-3 px-6 text-center">
      <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Enterprise ERP</p>
      <h1 className="font-semibold text-2xl">This screen is not part of the demonstration.</h1>
      <p className="max-w-md text-muted-foreground text-sm">
        The page you requested could not be found. Return to the enterprise overview to continue exploring the platform.
      </p>
      <Link prefetch={false} href="/dashboard">
        <Button variant="outline">Back to dashboard</Button>
      </Link>
    </div>
  );
}
