"use client";

// Form for Item Attribute Value
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemAttributeValue } from "../types/item-attribute-value.js";
import { ItemAttributeValueInsertSchema } from "../types/item-attribute-value.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemAttributeValueFormProps {
  initialData?: Partial<ItemAttributeValue>;
  onSubmit: (data: Partial<ItemAttributeValue>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemAttributeValueForm({ initialData = {}, onSubmit, mode, isLoading }: ItemAttributeValueFormProps) {
  const form = useForm<Partial<ItemAttributeValue>>({
    resolver: zodResolver(ItemAttributeValueInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Attribute Value" : "New Item Attribute Value"}
        </h2>
            <FormField control={form.control} name="attribute_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Attribute Value</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="abbr" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Abbreviation</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This will be appended to the Item Code of the variant. For example, if your abbreviation is &quot;SM&quot;, and the item code is &quot;T-SHIRT&quot;, the item code of the variant will be &quot;T-SHIRT-SM&quot;</FormDescription>
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