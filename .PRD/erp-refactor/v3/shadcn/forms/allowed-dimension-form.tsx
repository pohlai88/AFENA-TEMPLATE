"use client";

// Form for Allowed Dimension
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AllowedDimension } from "../types/allowed-dimension.js";
import { AllowedDimensionInsertSchema } from "../types/allowed-dimension.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AllowedDimensionFormProps {
  initialData?: Partial<AllowedDimension>;
  onSubmit: (data: Partial<AllowedDimension>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AllowedDimensionForm({ initialData = {}, onSubmit, mode, isLoading }: AllowedDimensionFormProps) {
  const form = useForm<Partial<AllowedDimension>>({
    resolver: zodResolver(AllowedDimensionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Allowed Dimension" : "New Allowed Dimension"}
        </h2>
            <FormField control={form.control} name="accounting_dimension" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accounting Dimension (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dimension_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">dimension_value</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
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