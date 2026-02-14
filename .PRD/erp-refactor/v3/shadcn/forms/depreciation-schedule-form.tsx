"use client";

// Form for Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DepreciationSchedule } from "../types/depreciation-schedule.js";
import { DepreciationScheduleInsertSchema } from "../types/depreciation-schedule.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DepreciationScheduleFormProps {
  initialData?: Partial<DepreciationSchedule>;
  onSubmit: (data: Partial<DepreciationSchedule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DepreciationScheduleForm({ initialData = {}, onSubmit, mode, isLoading }: DepreciationScheduleFormProps) {
  const form = useForm<Partial<DepreciationSchedule>>({
    resolver: zodResolver(DepreciationScheduleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Depreciation Schedule" : "New Depreciation Schedule"}
        </h2>
            <FormField control={form.control} name="schedule_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Schedule Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accumulated_depreciation_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accumulated Depreciation Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus===1 && (
            <FormField control={form.control} name="journal_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Journal Entry (→ Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="shift" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shift (→ Asset Shift Factor)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Shift Factor..." {...f} value={(f.value as string) ?? ""} />
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