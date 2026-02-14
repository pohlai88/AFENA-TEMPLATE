"use client";

// Form for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardScoringVariable } from "../types/supplier-scorecard-scoring-variable.js";
import { SupplierScorecardScoringVariableInsertSchema } from "../types/supplier-scorecard-scoring-variable.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SupplierScorecardScoringVariableFormProps {
  initialData?: Partial<SupplierScorecardScoringVariable>;
  onSubmit: (data: Partial<SupplierScorecardScoringVariable>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardScoringVariableForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardScoringVariableFormProps) {
  const form = useForm<Partial<SupplierScorecardScoringVariable>>({
    resolver: zodResolver(SupplierScorecardScoringVariableInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Scoring Variable" : "New Supplier Scorecard Scoring Variable"}
        </h2>
            <FormField control={form.control} name="variable_label" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Variable Name (→ Supplier Scorecard Variable)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Scorecard Variable..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value</FormLabel>
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