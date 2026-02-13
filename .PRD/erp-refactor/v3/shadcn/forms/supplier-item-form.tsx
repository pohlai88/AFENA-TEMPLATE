"use client";

// Form for Supplier Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierItem } from "../types/supplier-item.js";
import { SupplierItemInsertSchema } from "../types/supplier-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SupplierItemFormProps {
  initialData?: Partial<SupplierItem>;
  onSubmit: (data: Partial<SupplierItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierItemForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierItemFormProps) {
  const form = useForm<Partial<SupplierItem>>({
    resolver: zodResolver(SupplierItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Item" : "New Supplier Item"}
        </h2>
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
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