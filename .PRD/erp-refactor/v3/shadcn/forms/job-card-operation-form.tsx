"use client";

// Form for Job Card Operation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JobCardOperation } from "../types/job-card-operation.js";
import { JobCardOperationInsertSchema } from "../types/job-card-operation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface JobCardOperationFormProps {
  initialData?: Partial<JobCardOperation>;
  onSubmit: (data: Partial<JobCardOperation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function JobCardOperationForm({ initialData = {}, onSubmit, mode, isLoading }: JobCardOperationFormProps) {
  const form = useForm<Partial<JobCardOperation>>({
    resolver: zodResolver(JobCardOperationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Job Card Operation" : "New Job Card Operation"}
        </h2>
            <FormField control={form.control} name="sub_operation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation (→ Operation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Operation..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="completed_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Completed Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="completed_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Completed Time</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormDescription>In mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Pause">Pause</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Work In Progress">Work In Progress</SelectItem>
                  </SelectContent>
                </Select>
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