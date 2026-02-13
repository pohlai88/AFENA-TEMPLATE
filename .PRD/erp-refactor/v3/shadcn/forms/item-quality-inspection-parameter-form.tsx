"use client";

// Form for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemQualityInspectionParameter } from "../types/item-quality-inspection-parameter.js";
import { ItemQualityInspectionParameterInsertSchema } from "../types/item-quality-inspection-parameter.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ItemQualityInspectionParameterFormProps {
  initialData?: Partial<ItemQualityInspectionParameter>;
  onSubmit: (data: Partial<ItemQualityInspectionParameter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemQualityInspectionParameterForm({ initialData = {}, onSubmit, mode, isLoading }: ItemQualityInspectionParameterFormProps) {
  const form = useForm<Partial<ItemQualityInspectionParameter>>({
    resolver: zodResolver(ItemQualityInspectionParameterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Quality Inspection Parameter" : "New Item Quality Inspection Parameter"}
        </h2>
            <FormField control={form.control} name="specification" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter (→ Quality Inspection Parameter)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Inspection Parameter..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="parameter_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter Group (→ Quality Inspection Parameter Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Inspection Parameter Group..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {(!form.getValues().formula_based_criteria && !form.getValues().numeric) && (
            <FormField control={form.control} name="value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Acceptance Criteria Value</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="numeric" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Numeric</FormLabel>
                </div>
              </FormItem>
            )} />
            {(!form.getValues().formula_based_criteria && form.getValues().numeric) && (
            <FormField control={form.control} name="min_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Minimum Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(!form.getValues().formula_based_criteria && form.getValues().numeric) && (
            <FormField control={form.control} name="max_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maximum Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="formula_based_criteria" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Formula Based Criteria</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().formula_based_criteria && (
            <FormField control={form.control} name="acceptance_formula" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Acceptance Criteria Formula</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Simple Python formula applied on Reading fields.&lt;br&gt; Numeric eg. 1: &lt;b&gt;reading_1 &amp;gt; 0.2 and reading_1 &amp;lt; 0.5&lt;/b&gt;&lt;br&gt;
Numeric eg. 2: &lt;b&gt;mean &amp;gt; 3.5&lt;/b&gt; (mean of populated fields)&lt;br&gt;
Value based eg.:  &lt;b&gt;reading_value in (&quot;A&quot;, &quot;B&quot;, &quot;C&quot;)&lt;/b&gt;</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}