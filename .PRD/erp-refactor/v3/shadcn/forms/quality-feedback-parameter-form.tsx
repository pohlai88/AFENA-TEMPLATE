"use client";

// Form for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityFeedbackParameter } from "../types/quality-feedback-parameter.js";
import { QualityFeedbackParameterInsertSchema } from "../types/quality-feedback-parameter.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityFeedbackParameterFormProps {
  initialData?: Partial<QualityFeedbackParameter>;
  onSubmit: (data: Partial<QualityFeedbackParameter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityFeedbackParameterForm({ initialData = {}, onSubmit, mode, isLoading }: QualityFeedbackParameterFormProps) {
  const form = useForm<Partial<QualityFeedbackParameter>>({
    resolver: zodResolver(QualityFeedbackParameterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Feedback Parameter" : "New Quality Feedback Parameter"}
        </h2>
            <FormField control={form.control} name="parameter" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rating" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rating</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="feedback" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Feedback</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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