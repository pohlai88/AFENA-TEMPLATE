"use client";

// Form for Item Variant
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemVariant } from "../types/item-variant.js";
import { ItemVariantInsertSchema } from "../types/item-variant.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemVariantFormProps {
  initialData?: Partial<ItemVariant>;
  onSubmit: (data: Partial<ItemVariant>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemVariantForm({ initialData = {}, onSubmit, mode, isLoading }: ItemVariantFormProps) {
  const form = useForm<Partial<ItemVariant>>({
    resolver: zodResolver(ItemVariantInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Variant" : "New Item Variant"}
        </h2>
            <FormField control={form.control} name="item_attribute" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Attribute (→ Item Attribute)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Attribute..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_attribute_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Attribute Value</FormLabel>
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