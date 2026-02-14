"use client";

// Form for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LandedCostVendorInvoice } from "../types/landed-cost-vendor-invoice.js";
import { LandedCostVendorInvoiceInsertSchema } from "../types/landed-cost-vendor-invoice.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LandedCostVendorInvoiceFormProps {
  initialData?: Partial<LandedCostVendorInvoice>;
  onSubmit: (data: Partial<LandedCostVendorInvoice>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LandedCostVendorInvoiceForm({ initialData = {}, onSubmit, mode, isLoading }: LandedCostVendorInvoiceFormProps) {
  const form = useForm<Partial<LandedCostVendorInvoice>>({
    resolver: zodResolver(LandedCostVendorInvoiceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Landed Cost Vendor Invoice" : "New Landed Cost Vendor Invoice"}
        </h2>
            <FormField control={form.control} name="vendor_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Vendor Invoice (→ Purchase Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Invoice..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}