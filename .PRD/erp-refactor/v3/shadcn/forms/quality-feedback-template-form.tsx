"use client";

// Form for Quality Feedback Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityFeedbackTemplate } from "../types/quality-feedback-template.js";
import { QualityFeedbackTemplateInsertSchema } from "../types/quality-feedback-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityFeedbackTemplateFormProps {
  initialData?: Partial<QualityFeedbackTemplate>;
  onSubmit: (data: Partial<QualityFeedbackTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityFeedbackTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: QualityFeedbackTemplateFormProps) {
  const form = useForm<Partial<QualityFeedbackTemplate>>({
    resolver: zodResolver(QualityFeedbackTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Feedback Template" : "New Quality Feedback Template"}
        </h2>
            <FormField control={form.control} name="template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Template Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Parameters</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Quality Feedback Template Parameter — integrate with DataTable */}
                <p>Child table for Quality Feedback Template Parameter</p>
              </div>
            </div>
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