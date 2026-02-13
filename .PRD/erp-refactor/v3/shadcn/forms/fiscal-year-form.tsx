"use client";

// Form for Fiscal Year
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FiscalYear } from "../types/fiscal-year.js";
import { FiscalYearInsertSchema } from "../types/fiscal-year.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FiscalYearFormProps {
  initialData?: Partial<FiscalYear>;
  onSubmit: (data: Partial<FiscalYear>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function FiscalYearForm({ initialData = {}, onSubmit, mode, isLoading }: FiscalYearFormProps) {
  const form = useForm<Partial<FiscalYear>>({
    resolver: zodResolver(FiscalYearInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Fiscal Year" : "New Fiscal Year"}
        </h2>
            <FormField control={form.control} name="year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Year Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>For e.g. 2012, 2012-13</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_short_year" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Short/Long Year</FormLabel>
                  <FormDescription>More/Less than 12 months.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="year_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Year Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="year_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Year End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Companies</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Fiscal Year Company — integrate with DataTable */}
                <p>Child table for Fiscal Year Company</p>
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