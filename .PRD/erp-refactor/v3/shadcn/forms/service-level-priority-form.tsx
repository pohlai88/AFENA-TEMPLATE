"use client";

// Form for Service Level Priority
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ServiceLevelPriority } from "../types/service-level-priority.js";
import { ServiceLevelPriorityInsertSchema } from "../types/service-level-priority.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceLevelPriorityFormProps {
  initialData?: Partial<ServiceLevelPriority>;
  onSubmit: (data: Partial<ServiceLevelPriority>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ServiceLevelPriorityForm({ initialData = {}, onSubmit, mode, isLoading }: ServiceLevelPriorityFormProps) {
  const form = useForm<Partial<ServiceLevelPriority>>({
    resolver: zodResolver(ServiceLevelPriorityInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Service Level Priority" : "New Service Level Priority"}
        </h2>
            <FormField control={form.control} name="default_priority" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default Priority</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="priority" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Priority (→ Issue Priority)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Issue Priority..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="response_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">First Response Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="resolution_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Resolution Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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