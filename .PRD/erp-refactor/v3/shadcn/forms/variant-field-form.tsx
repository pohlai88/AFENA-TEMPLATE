"use client";

// Form for Variant Field
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantField } from "../types/variant-field.js";
import { VariantFieldInsertSchema } from "../types/variant-field.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface VariantFieldFormProps {
  initialData?: Partial<VariantField>;
  onSubmit: (data: Partial<VariantField>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function VariantFieldForm({ initialData = {}, onSubmit, mode, isLoading }: VariantFieldFormProps) {
  const form = useForm<Partial<VariantField>>({
    resolver: zodResolver(VariantFieldInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Variant Field" : "New Variant Field"}
        </h2>
            <FormField control={form.control} name="field_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Field Name</FormLabel>
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