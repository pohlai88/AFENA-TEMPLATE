"use client";

// Form for POS Invoice Merge Log
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosInvoiceMergeLog } from "../types/pos-invoice-merge-log.js";
import { PosInvoiceMergeLogInsertSchema } from "../types/pos-invoice-merge-log.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PosInvoiceMergeLogFormProps {
  initialData?: Partial<PosInvoiceMergeLog>;
  onSubmit: (data: Partial<PosInvoiceMergeLog>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosInvoiceMergeLogForm({ initialData = {}, onSubmit, mode, isLoading }: PosInvoiceMergeLogFormProps) {
  const form = useForm<Partial<PosInvoiceMergeLog>>({
    resolver: zodResolver(PosInvoiceMergeLogInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Invoice Merge Log" : "New POS Invoice Merge Log"}
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
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="merge_invoices_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Merge Invoices Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Customer Group">Customer Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pos_closing_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">POS Closing Entry (→ POS Closing Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search POS Closing Entry..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().merge_invoices_based_on === 'Customer Group' && (
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">POS Invoices</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: POS Invoice Reference — integrate with DataTable */}
                <p>Child table for POS Invoice Reference</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="consolidated_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Consolidated Sales Invoice (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="consolidated_credit_note" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Consolidated Credit Note (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ POS Invoice Merge Log)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search POS Invoice Merge Log..." {...f} value={(f.value as string) ?? ""} disabled />
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