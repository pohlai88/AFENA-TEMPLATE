"use client";

// Form for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LandedCostTaxesAndCharges } from "../types/landed-cost-taxes-and-charges.js";
import { LandedCostTaxesAndChargesInsertSchema } from "../types/landed-cost-taxes-and-charges.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface LandedCostTaxesAndChargesFormProps {
  initialData?: Partial<LandedCostTaxesAndCharges>;
  onSubmit: (data: Partial<LandedCostTaxesAndCharges>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LandedCostTaxesAndChargesForm({ initialData = {}, onSubmit, mode, isLoading }: LandedCostTaxesAndChargesFormProps) {
  const form = useForm<Partial<LandedCostTaxesAndCharges>>({
    resolver: zodResolver(LandedCostTaxesAndChargesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Landed Cost Taxes and Charges" : "New Landed Cost Taxes and Charges"}
        </h2>
            {cint(erpnext.is_perpetual_inventory_enabled(parent.company)) && (
            <FormField control={form.control} name="expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="account_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="exchange_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="has_corrective_cost" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Corrective Cost</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="has_operating_cost" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Operating Cost</FormLabel>
                </div>
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