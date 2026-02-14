"use client";

// Form for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetRepairPurchaseInvoice } from "../types/asset-repair-purchase-invoice.js";
import { AssetRepairPurchaseInvoiceInsertSchema } from "../types/asset-repair-purchase-invoice.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AssetRepairPurchaseInvoiceFormProps {
  initialData?: Partial<AssetRepairPurchaseInvoice>;
  onSubmit: (data: Partial<AssetRepairPurchaseInvoice>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetRepairPurchaseInvoiceForm({ initialData = {}, onSubmit, mode, isLoading }: AssetRepairPurchaseInvoiceFormProps) {
  const form = useForm<Partial<AssetRepairPurchaseInvoice>>({
    resolver: zodResolver(AssetRepairPurchaseInvoiceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Repair Purchase Invoice" : "New Asset Repair Purchase Invoice"}
        </h2>
            <FormField control={form.control} name="purchase_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Invoice (→ Purchase Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Invoice..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="repair_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Repair Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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