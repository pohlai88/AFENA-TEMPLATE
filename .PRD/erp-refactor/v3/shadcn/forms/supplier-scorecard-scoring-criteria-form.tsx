"use client";

// Form for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardScoringCriteria } from "../types/supplier-scorecard-scoring-criteria.js";
import { SupplierScorecardScoringCriteriaInsertSchema } from "../types/supplier-scorecard-scoring-criteria.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierScorecardScoringCriteriaFormProps {
  initialData?: Partial<SupplierScorecardScoringCriteria>;
  onSubmit: (data: Partial<SupplierScorecardScoringCriteria>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardScoringCriteriaForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardScoringCriteriaFormProps) {
  const form = useForm<Partial<SupplierScorecardScoringCriteria>>({
    resolver: zodResolver(SupplierScorecardScoringCriteriaInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Scoring Criteria" : "New Supplier Scorecard Scoring Criteria"}
        </h2>
            <FormField control={form.control} name="criteria_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Criteria Name (→ Supplier Scorecard Criteria)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Scorecard Criteria..." {...f} value={(f.value as string) ?? ""} />
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
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}