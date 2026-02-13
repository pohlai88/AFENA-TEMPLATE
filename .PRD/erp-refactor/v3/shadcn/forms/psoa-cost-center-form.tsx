"use client";

// Form for PSOA Cost Center
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PsoaCostCenter } from "../types/psoa-cost-center.js";
import { PsoaCostCenterInsertSchema } from "../types/psoa-cost-center.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PsoaCostCenterFormProps {
  initialData?: Partial<PsoaCostCenter>;
  onSubmit: (data: Partial<PsoaCostCenter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PsoaCostCenterForm({ initialData = {}, onSubmit, mode, isLoading }: PsoaCostCenterFormProps) {
  const form = useForm<Partial<PsoaCostCenter>>({
    resolver: zodResolver(PsoaCostCenterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "PSOA Cost Center" : "New PSOA Cost Center"}
        </h2>
            <FormField control={form.control} name="cost_center_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
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