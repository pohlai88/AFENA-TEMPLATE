"use client";

// Form for Dependent Task
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DependentTask } from "../types/dependent-task.js";
import { DependentTaskInsertSchema } from "../types/dependent-task.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DependentTaskFormProps {
  initialData?: Partial<DependentTask>;
  onSubmit: (data: Partial<DependentTask>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DependentTaskForm({ initialData = {}, onSubmit, mode, isLoading }: DependentTaskFormProps) {
  const form = useForm<Partial<DependentTask>>({
    resolver: zodResolver(DependentTaskInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Dependent Task" : "New Dependent Task"}
        </h2>
            <FormField control={form.control} name="task" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Task (→ Task)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Task..." {...f} value={(f.value as string) ?? ""} />
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