"use client";

// Form for Project Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectTemplate } from "../types/project-template.js";
import { ProjectTemplateInsertSchema } from "../types/project-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectTemplateFormProps {
  initialData?: Partial<ProjectTemplate>;
  onSubmit: (data: Partial<ProjectTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProjectTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: ProjectTemplateFormProps) {
  const form = useForm<Partial<ProjectTemplate>>({
    resolver: zodResolver(ProjectTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Project Template" : "New Project Template"}
        </h2>
            <FormField control={form.control} name="project_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project Type (→ Project Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Tasks</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Project Template Task — integrate with DataTable */}
                <p>Child table for Project Template Task</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}