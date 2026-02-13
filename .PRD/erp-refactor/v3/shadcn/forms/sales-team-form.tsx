"use client";

// Form for Sales Team
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesTeam } from "../types/sales-team.js";
import { SalesTeamInsertSchema } from "../types/sales-team.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SalesTeamFormProps {
  initialData?: Partial<SalesTeam>;
  onSubmit: (data: Partial<SalesTeam>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesTeamForm({ initialData = {}, onSubmit, mode, isLoading }: SalesTeamFormProps) {
  const form = useForm<Partial<SalesTeam>>({
    resolver: zodResolver(SalesTeamInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Team" : "New Sales Team"}
        </h2>
            <FormField control={form.control} name="sales_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Person (→ Sales Person)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Person..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contribution (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contribution to Net Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="commission_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Commission Rate</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="incentives" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Incentives</FormLabel>
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