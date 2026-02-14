"use client";

// Form for Tax Withholding Rate
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TaxWithholdingRate } from "../types/tax-withholding-rate.js";
import { TaxWithholdingRateInsertSchema } from "../types/tax-withholding-rate.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TaxWithholdingRateFormProps {
  initialData?: Partial<TaxWithholdingRate>;
  onSubmit: (data: Partial<TaxWithholdingRate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaxWithholdingRateForm({ initialData = {}, onSubmit, mode, isLoading }: TaxWithholdingRateFormProps) {
  const form = useForm<Partial<TaxWithholdingRate>>({
    resolver: zodResolver(TaxWithholdingRateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Tax Withholding Rate" : "New Tax Withholding Rate"}
        </h2>
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_withholding_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Group (→ Tax Withholding Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_withholding_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cumulative_threshold" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cumulative Threshold</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="single_threshold" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transaction Threshold</FormLabel>
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