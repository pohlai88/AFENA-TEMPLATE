"use client";

// Form for Asset Movement Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetMovementItem } from "../types/asset-movement-item.js";
import { AssetMovementItemInsertSchema } from "../types/asset-movement-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AssetMovementItemFormProps {
  initialData?: Partial<AssetMovementItem>;
  onSubmit: (data: Partial<AssetMovementItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetMovementItemForm({ initialData = {}, onSubmit, mode, isLoading }: AssetMovementItemFormProps) {
  const form = useForm<Partial<AssetMovementItem>>({
    resolver: zodResolver(AssetMovementItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Movement Item" : "New Asset Movement Item"}
        </h2>
            <FormField control={form.control} name="asset" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="source_location" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source Location (→ Location)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Location..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_employee" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Employee (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="asset_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="target_location" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Location (→ Location)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Location..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_employee" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Employee (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
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