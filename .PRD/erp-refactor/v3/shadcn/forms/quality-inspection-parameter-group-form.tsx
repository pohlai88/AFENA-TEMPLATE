"use client";

// Form for Quality Inspection Parameter Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityInspectionParameterGroup } from "../types/quality-inspection-parameter-group.js";
import { QualityInspectionParameterGroupInsertSchema } from "../types/quality-inspection-parameter-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QualityInspectionParameterGroupFormProps {
  initialData?: Partial<QualityInspectionParameterGroup>;
  onSubmit: (data: Partial<QualityInspectionParameterGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityInspectionParameterGroupForm({ initialData = {}, onSubmit, mode, isLoading }: QualityInspectionParameterGroupFormProps) {
  const form = useForm<Partial<QualityInspectionParameterGroup>>({
    resolver: zodResolver(QualityInspectionParameterGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Inspection Parameter Group" : "New Quality Inspection Parameter Group"}
        </h2>
            <FormField control={form.control} name="group_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parameter Group Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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