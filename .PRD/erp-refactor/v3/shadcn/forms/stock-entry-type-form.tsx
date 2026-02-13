"use client";

// Form for Stock Entry Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockEntryType } from "../types/stock-entry-type.js";
import { StockEntryTypeInsertSchema } from "../types/stock-entry-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface StockEntryTypeFormProps {
  initialData?: Partial<StockEntryType>;
  onSubmit: (data: Partial<StockEntryType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function StockEntryTypeForm({ initialData = {}, onSubmit, mode, isLoading }: StockEntryTypeFormProps) {
  const form = useForm<Partial<StockEntryType>>({
    resolver: zodResolver(StockEntryTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Stock Entry Type" : "New Stock Entry Type"}
        </h2>
            <FormField control={form.control} name="purpose" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purpose</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Material Issue">Material Issue</SelectItem>
                    <SelectItem value="Material Receipt">Material Receipt</SelectItem>
                    <SelectItem value="Material Transfer">Material Transfer</SelectItem>
                    <SelectItem value="Material Transfer for Manufacture">Material Transfer for Manufacture</SelectItem>
                    <SelectItem value="Material Consumption for Manufacture">Material Consumption for Manufacture</SelectItem>
                    <SelectItem value="Manufacture">Manufacture</SelectItem>
                    <SelectItem value="Repack">Repack</SelectItem>
                    <SelectItem value="Send to Subcontractor">Send to Subcontractor</SelectItem>
                    <SelectItem value="Disassemble">Disassemble</SelectItem>
                    <SelectItem value="Receive from Customer">Receive from Customer</SelectItem>
                    <SelectItem value="Return Raw Material to Customer">Return Raw Material to Customer</SelectItem>
                    <SelectItem value="Subcontracting Delivery">Subcontracting Delivery</SelectItem>
                    <SelectItem value="Subcontracting Return">Subcontracting Return</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().purpose === 'Material Transfer' && (
            <FormField control={form.control} name="add_to_transit" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Add to Transit</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_standard" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Standard</FormLabel>
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