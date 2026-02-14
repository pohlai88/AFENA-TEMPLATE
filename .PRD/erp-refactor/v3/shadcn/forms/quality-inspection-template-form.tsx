"use client";

// Form for Quality Inspection Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityInspectionTemplate } from "../types/quality-inspection-template.js";
import { QualityInspectionTemplateInsertSchema } from "../types/quality-inspection-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QualityInspectionTemplateFormProps {
  initialData?: Partial<QualityInspectionTemplate>;
  onSubmit: (data: Partial<QualityInspectionTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityInspectionTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: QualityInspectionTemplateFormProps) {
  const form = useForm<Partial<QualityInspectionTemplate>>({
    resolver: zodResolver(QualityInspectionTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Inspection Template" : "New Quality Inspection Template"}
        </h2>
            <FormField control={form.control} name="quality_inspection_template_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quality Inspection Template Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Item Quality Inspection Parameter</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Quality Inspection Parameter — integrate with DataTable */}
                <p>Child table for Item Quality Inspection Parameter</p>
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