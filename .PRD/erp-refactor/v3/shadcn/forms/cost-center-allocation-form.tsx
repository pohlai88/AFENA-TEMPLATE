"use client";

// Form for Cost Center Allocation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CostCenterAllocation } from "../types/cost-center-allocation.js";
import { CostCenterAllocationInsertSchema } from "../types/cost-center-allocation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostCenterAllocationFormProps {
  initialData?: Partial<CostCenterAllocation>;
  onSubmit: (data: Partial<CostCenterAllocation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CostCenterAllocationForm({ initialData = {}, onSubmit, mode, isLoading }: CostCenterAllocationFormProps) {
  const form = useForm<Partial<CostCenterAllocation>>({
    resolver: zodResolver(CostCenterAllocationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Cost Center Allocation" : "New Cost Center Allocation"}
        </h2>
            <FormField control={form.control} name="main_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Main Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valid_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Cost Center Allocation Percentages</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Cost Center Allocation Percentage — integrate with DataTable */}
                <p>Child table for Cost Center Allocation Percentage</p>
              </div>
            </div>
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Cost Center Allocation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center Allocation..." {...f} value={(f.value as string) ?? ""} disabled />
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