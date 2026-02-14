"use client";

// Form for Item Lead Time
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemLeadTime } from "../types/item-lead-time.js";
import { ItemLeadTimeInsertSchema } from "../types/item-lead-time.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemLeadTimeFormProps {
  initialData?: Partial<ItemLeadTime>;
  onSubmit: (data: Partial<ItemLeadTime>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemLeadTimeForm({ initialData = {}, onSubmit, mode, isLoading }: ItemLeadTimeFormProps) {
  const form = useForm<Partial<ItemLeadTime>>({
    resolver: zodResolver(ItemLeadTimeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Lead Time" : "New Item Lead Time"}
        </h2>
        <Tabs defaultValue="manufacturing-time" className="w-full">
          <TabsList>
            <TabsTrigger value="manufacturing-time">Manufacturing Time</TabsTrigger>
            <TabsTrigger value="purchase-time">Purchase Time</TabsTrigger>
            <TabsTrigger value="item-details">Item Details</TabsTrigger>
          </TabsList>
          <TabsContent value="manufacturing-time" className="space-y-4">
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workstation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="shift_time_in_hours" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shift Time (In Hours)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Per Day</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_of_workstations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Workstations</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Similar types of workstations where the same operations run in parallel.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_of_shift" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Shift</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_workstation_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Workstation Time (In Hours)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Per Day
Shift Time (In Hours) * No of Workstations * No of Shift</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manufacturing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="manufacturing_time_in_mins" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Manufacturing Time</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Per Unit Time in Mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_of_units_produced" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Units Produced</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>(Total Workstation Time / Manufacturing Time) * 60</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="daily_yield" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Daily Yield (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>(Good Units Produced / Total Units Produced) × 100</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="capacity_per_day" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Capacity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>(Daily Yield * No of Units Produced) / 100</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="purchase-time" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="purchase_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Time</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>In Days</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="buffer_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Buffer Time</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>In Days</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="item-details" className="space-y-4">
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}