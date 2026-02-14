"use client";

// Form for Asset Shift Factor
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetShiftFactor } from "../types/asset-shift-factor.js";
import { AssetShiftFactorInsertSchema } from "../types/asset-shift-factor.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AssetShiftFactorFormProps {
  initialData?: Partial<AssetShiftFactor>;
  onSubmit: (data: Partial<AssetShiftFactor>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetShiftFactorForm({ initialData = {}, onSubmit, mode, isLoading }: AssetShiftFactorFormProps) {
  const form = useForm<Partial<AssetShiftFactor>>({
    resolver: zodResolver(AssetShiftFactorInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Shift Factor" : "New Asset Shift Factor"}
        </h2>
            <FormField control={form.control} name="shift_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shift Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shift_factor" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shift Factor</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default</FormLabel>
                </div>
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