"use client";

// Form for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JobCardScheduledTime } from "../types/job-card-scheduled-time.js";
import { JobCardScheduledTimeInsertSchema } from "../types/job-card-scheduled-time.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface JobCardScheduledTimeFormProps {
  initialData?: Partial<JobCardScheduledTime>;
  onSubmit: (data: Partial<JobCardScheduledTime>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function JobCardScheduledTimeForm({ initialData = {}, onSubmit, mode, isLoading }: JobCardScheduledTimeFormProps) {
  const form = useForm<Partial<JobCardScheduledTime>>({
    resolver: zodResolver(JobCardScheduledTimeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Job Card Scheduled Time" : "New Job Card Scheduled Time"}
        </h2>
            <FormField control={form.control} name="from_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="time_in_mins" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Time (In Mins)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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