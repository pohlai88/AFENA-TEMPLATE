"use client";

// Form for Item Variant Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemVariantSettings } from "../types/item-variant-settings.js";
import { ItemVariantSettingsInsertSchema } from "../types/item-variant-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemVariantSettingsFormProps {
  initialData?: Partial<ItemVariantSettings>;
  onSubmit: (data: Partial<ItemVariantSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemVariantSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: ItemVariantSettingsFormProps) {
  const form = useForm<Partial<ItemVariantSettings>>({
    resolver: zodResolver(ItemVariantSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Variant Settings" : "New Item Variant Settings"}
        </h2>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="do_not_update_variants" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Do not update variants on save</FormLabel>
                  <FormDescription>Fields will be copied over only at time of creation.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_rename_attribute_value" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Rename Attribute Value</FormLabel>
                  <FormDescription>Rename Attribute Value in Item Attribute.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_different_uom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Variant UOM to be different from Template UOM</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Copy Fields to Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Fields</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Variant Field — integrate with DataTable */}
                <p>Child table for Variant Field</p>
              </div>
            </div>
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