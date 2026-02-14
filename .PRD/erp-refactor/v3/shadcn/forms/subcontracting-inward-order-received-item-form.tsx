"use client";

// Form for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubcontractingInwardOrderReceivedItem } from "../types/subcontracting-inward-order-received-item.js";
import { SubcontractingInwardOrderReceivedItemInsertSchema } from "../types/subcontracting-inward-order-received-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubcontractingInwardOrderReceivedItemFormProps {
  initialData?: Partial<SubcontractingInwardOrderReceivedItem>;
  onSubmit: (data: Partial<SubcontractingInwardOrderReceivedItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubcontractingInwardOrderReceivedItemForm({ initialData = {}, onSubmit, mode, isLoading }: SubcontractingInwardOrderReceivedItemFormProps) {
  const form = useForm<Partial<SubcontractingInwardOrderReceivedItem>>({
    resolver: zodResolver(SubcontractingInwardOrderReceivedItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Subcontracting Inward Order Received Item" : "New Subcontracting Inward Order Received Item"}
        </h2>
            <FormField control={form.control} name="main_item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rm_item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Raw Material Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_customer_provided_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Customer Provided Item</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_additional_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Additional Item</FormLabel>
                </div>
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
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bom_detail_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">BOM Detail No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reference_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().required_qty && (
            <FormField control={form.control} name="required_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Required Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().is_customer_provided_item && (
            <FormField control={form.control} name="billed_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billed Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_customer_provided_item && (
            <FormField control={form.control} name="received_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Received Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="consumed_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Consumed Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!(!form.getValues().is_customer_provided_item && form.getValues().is_additional_item) && (
            <FormField control={form.control} name="work_order_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Work Order Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_customer_provided_item && (
            <FormField control={form.control} name="returned_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Returned Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
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