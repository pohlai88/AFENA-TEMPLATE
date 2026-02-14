"use client";

// Form for Accounting Dimension
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountingDimension } from "../types/accounting-dimension.js";
import { AccountingDimensionInsertSchema } from "../types/accounting-dimension.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AccountingDimensionFormProps {
  initialData?: Partial<AccountingDimension>;
  onSubmit: (data: Partial<AccountingDimension>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountingDimensionForm({ initialData = {}, onSubmit, mode, isLoading }: AccountingDimensionFormProps) {
  const form = useForm<Partial<AccountingDimension>>({
    resolver: zodResolver(AccountingDimensionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Accounting Dimension" : "New Accounting Dimension"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Document Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="label" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Dimension Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Dimension Defaults</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Accounting Dimension Detail — integrate with DataTable */}
                <p>Child table for Accounting Dimension Detail</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}