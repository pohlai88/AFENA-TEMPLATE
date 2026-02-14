"use client";

// Form for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityFeedbackTemplateParameter } from "../types/quality-feedback-template-parameter.js";
import { QualityFeedbackTemplateParameterInsertSchema } from "../types/quality-feedback-template-parameter.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QualityFeedbackTemplateParameterFormProps {
  initialData?: Partial<QualityFeedbackTemplateParameter>;
  onSubmit: (data: Partial<QualityFeedbackTemplateParameter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityFeedbackTemplateParameterForm({ initialData = {}, onSubmit, mode, isLoading }: QualityFeedbackTemplateParameterFormProps) {
  const form = useForm<Partial<QualityFeedbackTemplateParameter>>({
    resolver: zodResolver(QualityFeedbackTemplateParameterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Feedback Template Parameter" : "New Quality Feedback Template Parameter"}
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}