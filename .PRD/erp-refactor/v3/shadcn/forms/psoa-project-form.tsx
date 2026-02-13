"use client";

// Form for PSOA Project
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PsoaProject } from "../types/psoa-project.js";
import { PsoaProjectInsertSchema } from "../types/psoa-project.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PsoaProjectFormProps {
  initialData?: Partial<PsoaProject>;
  onSubmit: (data: Partial<PsoaProject>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PsoaProjectForm({ initialData = {}, onSubmit, mode, isLoading }: PsoaProjectFormProps) {
  const form = useForm<Partial<PsoaProject>>({
    resolver: zodResolver(PsoaProjectInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "PSOA Project" : "New PSOA Project"}
        </h2>
            <FormField control={form.control} name="project_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
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