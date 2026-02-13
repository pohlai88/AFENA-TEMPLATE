"use client";

// Form for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityInspectionParameter } from "../types/quality-inspection-parameter.js";
import { QualityInspectionParameterInsertSchema } from "../types/quality-inspection-parameter.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QualityInspectionParameterFormProps {
  initialData?: Partial<QualityInspectionParameter>;
  onSubmit: (data: Partial<QualityInspectionParameter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityInspectionParameterForm({ initialData = {}, onSubmit, mode, isLoading }: QualityInspectionParameterFormProps) {
  const form = useForm<Partial<QualityInspectionParameter>>({
    resolver: zodResolver(QualityInspectionParameterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Inspection Parameter" : "New Quality Inspection Parameter"}
        </h2>
            <FormField control={form.control} name="parameter" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="parameter_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter Group (→ Quality Inspection Parameter Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Inspection Parameter Group..." {...f} value={(f.value as string) ?? ""} />
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