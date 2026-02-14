"use client";

// Form for Purchase Invoice Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PurchaseInvoiceItem } from "../types/purchase-invoice-item.js";
import { PurchaseInvoiceItemInsertSchema } from "../types/purchase-invoice-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseInvoiceItemFormProps {
  initialData?: Partial<PurchaseInvoiceItem>;
  onSubmit: (data: Partial<PurchaseInvoiceItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PurchaseInvoiceItemForm({ initialData = {}, onSubmit, mode, isLoading }: PurchaseInvoiceItemFormProps) {
  const form = useForm<Partial<PurchaseInvoiceItem>>({
    resolver: zodResolver(PurchaseInvoiceItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Purchase Invoice Item" : "New Purchase Invoice Item"}
        </h2>
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="product_bundle" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Product Bundle (→ Product Bundle)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Product Bundle..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="image_view" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Image View</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quantity and Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Accepted Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rejected_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rejected Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().uom !== form.getValues().stock_uom && (
            <FormField control={form.control} name="conversion_factor" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM Conversion Factor</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().uom !== form.getValues().stock_uom && (
            <FormField control={form.control} name="stock_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().uom !== form.getValues().stock_uom && (
            <FormField control={form.control} name="stock_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accepted Qty in Stock UOM</FormLabel>
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
            <FormField control={form.control} name="price_list_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_price_list_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List Rate (Company Currency)</FormLabel>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discount and Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().price_list_rate && (
            <FormField control={form.control} name="margin_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Margin Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().margin_type && form.getValues().price_list_rate && (
            <FormField control={form.control} name="margin_rate_or_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Margin Rate or Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().margin_type && form.getValues().price_list_rate && form.getValues().margin_rate_or_amount && (
            <FormField control={form.control} name="rate_with_margin" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate With Margin</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().price_list_rate && (
            <FormField control={form.control} name="discount_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount on Price List Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().price_list_rate && (
            <FormField control={form.control} name="discount_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="distributed_discount_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Distributed Discount Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().margin_type && form.getValues().price_list_rate && form.getValues().margin_rate_or_amount && (
            <FormField control={form.control} name="base_rate_with_margin" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate With Margin (Company Currency)</FormLabel>
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
                <FormLabel className="font-semibold">Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_tax_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Tax Template (→ Item Tax Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Tax Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().uom !== form.getValues().stock_uom && (
            <FormField control={form.control} name="stock_uom_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate of Stock UOM</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_free_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Free Item</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="apply_tds" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Consider for Tax Withholding</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="net_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="net_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_net_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Rate (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_net_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="landed_cost_voucher_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Landed Cost Voucher Amount</FormLabel>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accepted Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.update_stock === 1 && (form.getValues().use_serial_batch_fields ==== 0 || form.getValues().docstatus ==== 1) && (
            <FormField control={form.control} name="serial_and_batch_bundle" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Serial and Batch Bundle (→ Serial and Batch Bundle)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Serial and Batch Bundle..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="use_serial_batch_fields" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Serial No / Batch Fields</FormLabel>
                </div>
              </FormItem>
            )} />
            {parent.is_internal_supplier && parent.update_stock && (
            <FormField control={form.control} name="from_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="quality_inspection" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quality Inspection (→ Quality Inspection)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Inspection..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="rejected_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rejected Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.update_stock === 1 && (form.getValues().use_serial_batch_fields ==== 0 || form.getValues().docstatus ==== 1) && (
            <FormField control={form.control} name="rejected_serial_and_batch_bundle" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rejected Serial and Batch Bundle (→ Serial and Batch Bundle)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Serial and Batch Bundle..." {...f} value={(f.value as string) ?? ""} />
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
            {!form.getValues().is_fixed_asset && form.getValues().use_serial_batch_fields ==== 1 && parent.update_stock ==== 1 && (
            <FormField control={form.control} name="serial_no" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Serial No</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().is_fixed_asset && form.getValues().use_serial_batch_fields ==== 1 && parent.update_stock ==== 1 && (
            <FormField control={form.control} name="rejected_serial_no" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Rejected Serial No</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().is_fixed_asset && form.getValues().use_serial_batch_fields ==== 1 && parent.update_stock ==== 1 && (
            <FormField control={form.control} name="batch_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Batch No (→ Batch)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Batch..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manufacture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="manufacturer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Manufacturer (→ Manufacturer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Manufacturer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="manufacturer_part_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Manufacturer Part Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expense Head (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="wip_composite_asset" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">WIP Composite Asset (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="asset_location" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Location (→ Location)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Location..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="asset_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Category (→ Asset Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Category..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deferred Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().enable_deferred_expense && (
            <FormField control={form.control} name="deferred_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Deferred Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().enable_deferred_expense && (
            <FormField control={form.control} name="service_stop_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Stop Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="enable_deferred_expense" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Deferred Expense</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().enable_deferred_expense && (
            <FormField control={form.control} name="service_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().enable_deferred_expense && (
            <FormField control={form.control} name="service_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_zero_valuation_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Zero Valuation Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            {parent.is_old_subcontracting_flow && (
            <FormField control={form.control} name="bom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">BOM (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {parent.is_subcontracted && (
            <FormField control={form.control} name="include_exploded_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include Exploded Items</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {parent.update_stock === 1 && (
            <FormField control={form.control} name="purchase_invoice_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Invoice Item</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="purchase_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Order (→ Purchase Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Order..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="purchase_receipt" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Receipt (→ Purchase Receipt)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Receipt..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sales_invoice_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Invoice Item</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="material_request" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Material Request (→ Material Request)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Material Request..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item Weight Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="weight_per_unit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Weight Per Unit</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Weight</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Weight UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="page_break" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Page Break</FormLabel>
                </div>
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