"use client";

// Form for Item Variant Attribute
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemVariantAttribute } from "../types/item-variant-attribute.js";
import { ItemVariantAttributeInsertSchema } from "../types/item-variant-attribute.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemVariantAttributeFormProps {
  initialData?: Partial<ItemVariantAttribute>;
  onSubmit: (data: Partial<ItemVariantAttribute>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemVariantAttributeForm({ initialData = {}, onSubmit, mode, isLoading }: ItemVariantAttributeFormProps) {
  const form = useForm<Partial<ItemVariantAttribute>>({
    resolver: zodResolver(ItemVariantAttributeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Variant Attribute" : "New Item Variant Attribute"}
        </h2>
            <FormField control={form.control} name="variant_of" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Variant Of (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="attribute" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Attribute (→ Item Attribute)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Attribute..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="attribute_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Attribute Value</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().has_variants && (
            <FormField control={form.control} name="numeric_values" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Numeric Values</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="from_range" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Range</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="increment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Increment</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_range" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Range</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}