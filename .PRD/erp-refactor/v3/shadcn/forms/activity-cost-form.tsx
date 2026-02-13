"use client";

// Form for Activity Cost
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActivityCost } from "../types/activity-cost.js";
import { ActivityCostInsertSchema } from "../types/activity-cost.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityCostFormProps {
  initialData?: Partial<ActivityCost>;
  onSubmit: (data: Partial<ActivityCost>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ActivityCostForm({ initialData = {}, onSubmit, mode, isLoading }: ActivityCostFormProps) {
  const form = useForm<Partial<ActivityCost>>({
    resolver: zodResolver(ActivityCostInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Activity Cost" : "New Activity Cost"}
          </h2>
        </div>
            <FormField control={form.control} name="activity_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Activity Type (→ Activity Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Activity Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="employee" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Employee (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="employee_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Employee Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="department" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Department (→ Department)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Department..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billing_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billing Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>per hour</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="costing_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Costing Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>per hour</FormDescription>
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