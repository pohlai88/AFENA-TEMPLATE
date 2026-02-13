"use client";

// Form for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityMeetingMinutes } from "../types/quality-meeting-minutes.js";
import { QualityMeetingMinutesInsertSchema } from "../types/quality-meeting-minutes.js";

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

interface QualityMeetingMinutesFormProps {
  initialData?: Partial<QualityMeetingMinutes>;
  onSubmit: (data: Partial<QualityMeetingMinutes>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityMeetingMinutesForm({ initialData = {}, onSubmit, mode, isLoading }: QualityMeetingMinutesFormProps) {
  const form = useForm<Partial<QualityMeetingMinutes>>({
    resolver: zodResolver(QualityMeetingMinutesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Meeting Minutes" : "New Quality Meeting Minutes"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Document Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Quality Review">Quality Review</SelectItem>
                    <SelectItem value="Quality Action">Quality Action</SelectItem>
                    <SelectItem value="Quality Feedback">Quality Feedback</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="document_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Document Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="minute" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Minute</FormLabel>
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