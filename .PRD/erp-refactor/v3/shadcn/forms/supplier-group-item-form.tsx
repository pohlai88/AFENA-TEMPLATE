"use client";

// Form for Supplier Group Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierGroupItem } from "../types/supplier-group-item.js";
import { SupplierGroupItemInsertSchema } from "../types/supplier-group-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SupplierGroupItemFormProps {
  initialData?: Partial<SupplierGroupItem>;
  onSubmit: (data: Partial<SupplierGroupItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierGroupItemForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierGroupItemFormProps) {
  const form = useForm<Partial<SupplierGroupItem>>({
    resolver: zodResolver(SupplierGroupItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Group Item" : "New Supplier Group Item"}
        </h2>
            <FormField control={form.control} name="supplier_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Group (→ Supplier Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Group..." {...f} value={(f.value as string) ?? ""} />
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