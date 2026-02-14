"use client";

// Form for Project Template Task
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectTemplateTask } from "../types/project-template-task.js";
import { ProjectTemplateTaskInsertSchema } from "../types/project-template-task.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProjectTemplateTaskFormProps {
  initialData?: Partial<ProjectTemplateTask>;
  onSubmit: (data: Partial<ProjectTemplateTask>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProjectTemplateTaskForm({ initialData = {}, onSubmit, mode, isLoading }: ProjectTemplateTaskFormProps) {
  const form = useForm<Partial<ProjectTemplateTask>>({
    resolver: zodResolver(ProjectTemplateTaskInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Project Template Task" : "New Project Template Task"}
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
              <FormItem>
                <FormLabel className="">Subject</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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