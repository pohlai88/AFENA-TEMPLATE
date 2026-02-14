"use client";

// Form for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OpeningInvoiceCreationToolItem } from "../types/opening-invoice-creation-tool-item.js";
import { OpeningInvoiceCreationToolItemInsertSchema } from "../types/opening-invoice-creation-tool-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OpeningInvoiceCreationToolItemFormProps {
  initialData?: Partial<OpeningInvoiceCreationToolItem>;
  onSubmit: (data: Partial<OpeningInvoiceCreationToolItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function OpeningInvoiceCreationToolItemForm({ initialData = {}, onSubmit, mode, isLoading }: OpeningInvoiceCreationToolItemFormProps) {
  const form = useForm<Partial<OpeningInvoiceCreationToolItem>>({
    resolver: zodResolver(OpeningInvoiceCreationToolItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Opening Invoice Creation Tool Item" : "New Opening Invoice Creation Tool Item"}
        </h2>
            <FormField control={form.control} name="invoice_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Reference number of the invoice from the previous system</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="party" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Party</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="temporary_opening_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Temporary Opening Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="due_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.invoice_type === "Purchase" && (
            <FormField control={form.control} name="supplier_invoice_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="outstanding_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quantity</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}