"use client";

// Form for Supplier Scorecard Period
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardPeriod } from "../types/supplier-scorecard-period.js";
import { SupplierScorecardPeriodInsertSchema } from "../types/supplier-scorecard-period.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierScorecardPeriodFormProps {
  initialData?: Partial<SupplierScorecardPeriod>;
  onSubmit: (data: Partial<SupplierScorecardPeriod>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardPeriodForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardPeriodFormProps) {
  const form = useForm<Partial<SupplierScorecardPeriod>>({
    resolver: zodResolver(SupplierScorecardPeriodInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Period" : "New Supplier Scorecard Period"}
        </h2>
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Naming Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_score" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Period Score</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Criteria</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Supplier Scorecard Scoring Criteria — integrate with DataTable */}
                <p>Child table for Supplier Scorecard Scoring Criteria</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">Variables</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Supplier Scorecard Scoring Variable — integrate with DataTable */}
                <p>Child table for Supplier Scorecard Scoring Variable</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="scorecard" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Scorecard Setup (→ Supplier Scorecard)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Scorecard..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Supplier Scorecard Period)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Scorecard Period..." {...f} value={(f.value as string) ?? ""} disabled />
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