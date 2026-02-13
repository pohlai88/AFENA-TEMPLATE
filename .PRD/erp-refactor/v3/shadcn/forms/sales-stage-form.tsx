"use client";

// Form for Sales Stage
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesStage } from "../types/sales-stage.js";
import { SalesStageInsertSchema } from "../types/sales-stage.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SalesStageFormProps {
  initialData?: Partial<SalesStage>;
  onSubmit: (data: Partial<SalesStage>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesStageForm({ initialData = {}, onSubmit, mode, isLoading }: SalesStageFormProps) {
  const form = useForm<Partial<SalesStage>>({
    resolver: zodResolver(SalesStageInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Stage" : "New Sales Stage"}
        </h2>
            <FormField control={form.control} name="stage_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stage Name</FormLabel>
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