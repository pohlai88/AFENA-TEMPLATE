"use client";

// Form for Unreconcile Payment
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UnreconcilePayment } from "../types/unreconcile-payment.js";
import { UnreconcilePaymentInsertSchema } from "../types/unreconcile-payment.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UnreconcilePaymentFormProps {
  initialData?: Partial<UnreconcilePayment>;
  onSubmit: (data: Partial<UnreconcilePayment>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function UnreconcilePaymentForm({ initialData = {}, onSubmit, mode, isLoading }: UnreconcilePaymentFormProps) {
  const form = useForm<Partial<UnreconcilePayment>>({
    resolver: zodResolver(UnreconcilePaymentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Unreconcile Payment" : "New Unreconcile Payment"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Allocations</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Unreconcile Payment Entries — integrate with DataTable */}
                <p>Child table for Unreconcile Payment Entries</p>
              </div>
            </div>
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Unreconcile Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Unreconcile Payment..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}