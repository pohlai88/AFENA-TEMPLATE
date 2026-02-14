"use client";

// Form for Asset Finance Book
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetFinanceBook } from "../types/asset-finance-book.js";
import { AssetFinanceBookInsertSchema } from "../types/asset-finance-book.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetFinanceBookFormProps {
  initialData?: Partial<AssetFinanceBook>;
  onSubmit: (data: Partial<AssetFinanceBook>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetFinanceBookForm({ initialData = {}, onSubmit, mode, isLoading }: AssetFinanceBookFormProps) {
  const form = useForm<Partial<AssetFinanceBook>>({
    resolver: zodResolver(AssetFinanceBookInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Finance Book" : "New Asset Finance Book"}
        </h2>
            <FormField control={form.control} name="finance_book" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finance Book (→ Finance Book)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Finance Book..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Method</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Straight Line">Straight Line</SelectItem>
                    <SelectItem value="Double Declining Balance">Double Declining Balance</SelectItem>
                    <SelectItem value="Written Down Value">Written Down Value</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="frequency_of_depreciation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Frequency of Depreciation (Months)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_number_of_depreciations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Number of Depreciations</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="increase_in_asset_life" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Increase In Asset Life (Months)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>via Asset Repair</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="salvage_value_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Salvage Value Percentage</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.doctype === 'Asset' && (
            <FormField control={form.control} name="expected_value_after_useful_life" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Salvage Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Expected Value After Useful Life</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().depreciation_method === 'Written Down Value' && (
            <FormField control={form.control} name="rate_of_depreciation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate of Depreciation (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="daily_prorata_based" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Depreciate based on daily pro-rata</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().depreciation_method === "Straight Line" && (
            <FormField control={form.control} name="shift_based" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Depreciate based on shifts</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="value_after_depreciation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value After Depreciation</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().total_number_of_booked_depreciations && (
            <FormField control={form.control} name="total_number_of_booked_depreciations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Number of Booked Depreciations </FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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