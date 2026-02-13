"use client";

// Form for Item Supplier
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemSupplier } from "../types/item-supplier.js";
import { ItemSupplierInsertSchema } from "../types/item-supplier.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemSupplierFormProps {
  initialData?: Partial<ItemSupplier>;
  onSubmit: (data: Partial<ItemSupplier>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemSupplierForm({ initialData = {}, onSubmit, mode, isLoading }: ItemSupplierFormProps) {
  const form = useForm<Partial<ItemSupplier>>({
    resolver: zodResolver(ItemSupplierInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Supplier" : "New Item Supplier"}
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
            <FormField control={form.control} name="supplier_part_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Part Number</FormLabel>
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