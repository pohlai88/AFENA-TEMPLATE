"use client";

// Form for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LandedCostPurchaseReceipt } from "../types/landed-cost-purchase-receipt.js";
import { LandedCostPurchaseReceiptInsertSchema } from "../types/landed-cost-purchase-receipt.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface LandedCostPurchaseReceiptFormProps {
  initialData?: Partial<LandedCostPurchaseReceipt>;
  onSubmit: (data: Partial<LandedCostPurchaseReceipt>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LandedCostPurchaseReceiptForm({ initialData = {}, onSubmit, mode, isLoading }: LandedCostPurchaseReceiptFormProps) {
  const form = useForm<Partial<LandedCostPurchaseReceipt>>({
    resolver: zodResolver(LandedCostPurchaseReceiptInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Landed Cost Purchase Receipt" : "New Landed Cost Purchase Receipt"}
        </h2>
            <FormField control={form.control} name="receipt_document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Receipt Document Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Purchase Invoice">Purchase Invoice</SelectItem>
                    <SelectItem value="Purchase Receipt">Purchase Receipt</SelectItem>
                    <SelectItem value="Stock Entry">Stock Entry</SelectItem>
                    <SelectItem value="Subcontracting Receipt">Subcontracting Receipt</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="receipt_document" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Receipt Document</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="grand_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Grand Total</FormLabel>
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