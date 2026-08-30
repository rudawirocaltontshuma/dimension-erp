"use client";

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { Printer } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface DemoActionButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  readonly message: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export function DemoActionButton({ message, description, children, ...props }: DemoActionButtonProps) {
  return (
    <Button {...props} onClick={() => toast.success(message, { description })}>
      {children}
    </Button>
  );
}

export function PrintButton({ label = "Print" }: { readonly label?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        toast.info("Print preview opened.", { description: "The browser print dialog uses the print stylesheet." });
        window.print();
      }}
    >
      <Printer data-icon="inline-start" />
      {label}
    </Button>
  );
}

interface DetailDrawerProps {
  readonly title: string;
  readonly description?: string;
  readonly trigger: ReactNode;
  readonly children: ReactNode;
}

export function DetailDrawer({ title, description, trigger, children }: DetailDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="space-y-6 px-4 pb-8">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

interface ConfirmDialogProps {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly successMessage?: string;
  readonly trigger: ReactNode;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  successMessage = "Demo changes applied.",
  trigger,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              toast.success(successMessage, { description: "This demonstration does not persist any changes." })
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
