"use client";

// Form for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardCriteria } from "../types/supplier-scorecard-criteria.js";
import { SupplierScorecardCriteriaInsertSchema } from "../types/supplier-scorecard-criteria.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SupplierScorecardCriteriaFormProps {
  initialData?: Partial<SupplierScorecardCriteria>;
  onSubmit: (data: Partial<SupplierScorecardCriteria>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardCriteriaForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardCriteriaFormProps) {
  const form = useForm<Partial<SupplierScorecardCriteria>>({
    resolver: zodResolver(SupplierScorecardCriteriaInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Criteria" : "New Supplier Scorecard Criteria"}
        </h2>
            <FormField control={form.control} name="criteria_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Criteria Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="max_score" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Score</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="formula" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Criteria Formula</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Criteria Weight</FormLabel>
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