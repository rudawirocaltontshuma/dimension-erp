"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export interface DemoFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  description?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string;
}

interface DemoFormDialogProps {
  readonly title: string;
  readonly description: string;
  readonly fields: DemoFormField[];
  readonly trigger: ReactNode;
  readonly submitLabel?: string;
  readonly successMessage?: string;
}

type FormValues = Record<string, string>;

function buildSchema(fields: DemoFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let rule = z.string();
    if (field.required) {
      rule = rule.min(1, `${field.label} is required.`);
    }
    if (field.type === "email") {
      rule = rule.refine((value) => !value || /.+@.+\..+/.test(value), { message: "Enter a valid email address." });
    }
    if (field.type === "number") {
      rule = rule.refine((value) => !value || !Number.isNaN(Number(value)), { message: "Enter a numeric value." });
    }
    shape[field.name] = rule;
  }
  return z.object(shape);
}

export function DemoFormDialog({
  title,
  description,
  fields,
  trigger,
  submitLabel = "Save Demo",
  successMessage = "Demo changes applied.",
}: DemoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const schema = buildSchema(fields);
  const defaultValues = fields.reduce<FormValues>((values, field) => {
    values[field.name] = field.defaultValue ?? "";
    return values;
  }, {});

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = form.handleSubmit((values) => {
    setOpen(false);
    form.reset(defaultValues);
    toast.success(successMessage, {
      description: `${title} captured for demonstration only — nothing is persisted in this frontend demo. (${Object.keys(values).length} fields validated)`,
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset(defaultValues);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(event);
          }}
          noValidate
        >
          <FieldGroup className="gap-4">
            {fields.map((field) => {
              const error = form.formState.errors[field.name];
              const fieldId = `demo-form-${field.name}`;
              return (
                <Field key={field.name}>
                  <FieldLabel htmlFor={fieldId}>
                    {field.label}
                    {field.required && (
                      <span aria-hidden className="text-destructive">
                        *
                      </span>
                    )}
                  </FieldLabel>
                  {field.type === "textarea" ? (
                    <Textarea id={fieldId} placeholder={field.placeholder} {...form.register(field.name)} />
                  ) : field.type === "select" ? (
                    <NativeSelect className="w-full" id={fieldId} {...form.register(field.name)}>
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Input
                      id={fieldId}
                      type={field.type === "number" ? "text" : (field.type ?? "text")}
                      inputMode={field.type === "number" ? "decimal" : undefined}
                      placeholder={field.placeholder}
                      {...form.register(field.name)}
                    />
                  )}
                  {field.description && <FieldDescription>{field.description}</FieldDescription>}
                  {error?.message && <FieldError>{String(error.message)}</FieldError>}
                </Field>
              );
            })}
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
