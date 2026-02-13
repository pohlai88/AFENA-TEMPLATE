"use client";

// Form for Quality Feedback
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityFeedback } from "../types/quality-feedback.js";
import { QualityFeedbackInsertSchema } from "../types/quality-feedback.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityFeedbackFormProps {
  initialData?: Partial<QualityFeedback>;
  onSubmit: (data: Partial<QualityFeedback>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityFeedbackForm({ initialData = {}, onSubmit, mode, isLoading }: QualityFeedbackFormProps) {
  const form = useForm<Partial<QualityFeedback>>({
    resolver: zodResolver(QualityFeedbackInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Feedback" : "New Quality Feedback"}
        </h2>
            <FormField control={form.control} name="template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Template (→ Quality Feedback Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Feedback Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="document_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Feedback By</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
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
                {/* Child table: Quality Feedback Parameter — integrate with DataTable */}
                <p>Child table for Quality Feedback Parameter</p>
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