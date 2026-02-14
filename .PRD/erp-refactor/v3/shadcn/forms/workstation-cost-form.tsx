"use client";

// Form for Workstation Cost
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WorkstationCost } from "../types/workstation-cost.js";
import { WorkstationCostInsertSchema } from "../types/workstation-cost.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WorkstationCostFormProps {
  initialData?: Partial<WorkstationCost>;
  onSubmit: (data: Partial<WorkstationCost>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WorkstationCostForm({ initialData = {}, onSubmit, mode, isLoading }: WorkstationCostFormProps) {
  const form = useForm<Partial<WorkstationCost>>({
    resolver: zodResolver(WorkstationCostInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Workstation Cost" : "New Workstation Cost"}
        </h2>
            <FormField control={form.control} name="operating_component" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operating Component (→ Workstation Operating Component)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation Operating Component..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operating Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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