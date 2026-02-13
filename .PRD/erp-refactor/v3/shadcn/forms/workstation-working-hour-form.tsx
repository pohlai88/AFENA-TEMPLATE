"use client";

// Form for Workstation Working Hour
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WorkstationWorkingHour } from "../types/workstation-working-hour.js";
import { WorkstationWorkingHourInsertSchema } from "../types/workstation-working-hour.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkstationWorkingHourFormProps {
  initialData?: Partial<WorkstationWorkingHour>;
  onSubmit: (data: Partial<WorkstationWorkingHour>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WorkstationWorkingHourForm({ initialData = {}, onSubmit, mode, isLoading }: WorkstationWorkingHourFormProps) {
  const form = useForm<Partial<WorkstationWorkingHour>>({
    resolver: zodResolver(WorkstationWorkingHourInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Workstation Working Hour" : "New Workstation Working Hour"}
        </h2>
            <FormField control={form.control} name="start_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="hours" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Hours</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="end_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="enabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enabled</FormLabel>
                </div>
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