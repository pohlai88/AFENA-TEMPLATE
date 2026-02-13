"use client";

// Form for Task Depends On
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TaskDependsOn } from "../types/task-depends-on.js";
import { TaskDependsOnInsertSchema } from "../types/task-depends-on.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TaskDependsOnFormProps {
  initialData?: Partial<TaskDependsOn>;
  onSubmit: (data: Partial<TaskDependsOn>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaskDependsOnForm({ initialData = {}, onSubmit, mode, isLoading }: TaskDependsOnFormProps) {
  const form = useForm<Partial<TaskDependsOn>>({
    resolver: zodResolver(TaskDependsOnInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Task Depends On" : "New Task Depends On"}
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
            <FormField control={form.control} name="subject" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Subject</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Project</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
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