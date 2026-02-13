"use client";

// Form for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardVariable } from "../types/supplier-scorecard-variable.js";
import { SupplierScorecardVariableInsertSchema } from "../types/supplier-scorecard-variable.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface SupplierScorecardVariableFormProps {
  initialData?: Partial<SupplierScorecardVariable>;
  onSubmit: (data: Partial<SupplierScorecardVariable>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardVariableForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardVariableFormProps) {
  const form = useForm<Partial<SupplierScorecardVariable>>({
    resolver: zodResolver(SupplierScorecardVariableInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Variable" : "New Supplier Scorecard Variable"}
        </h2>
            <FormField control={form.control} name="variable_label" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Variable Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_custom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Custom?</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="param_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="path" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Path</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}