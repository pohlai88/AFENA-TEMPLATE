"use client";

// Form for Stock Reservation Entry
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockReservationEntry } from "../types/stock-reservation-entry.js";
import { StockReservationEntryInsertSchema } from "../types/stock-reservation-entry.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockReservationEntryFormProps {
  initialData?: Partial<StockReservationEntry>;
  onSubmit: (data: Partial<StockReservationEntry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function StockReservationEntryForm({ initialData = {}, onSubmit, mode, isLoading }: StockReservationEntryFormProps) {
  const form = useForm<Partial<StockReservationEntry>>({
    resolver: zodResolver(StockReservationEntryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.voucher_no as string) ?? "Stock Reservation Entry" : "New Stock Reservation Entry"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="serial-and-batch-reservation" className="w-full">
          <TabsList>
            <TabsTrigger value="serial-and-batch-reservation">Serial and Batch Reservation</TabsTrigger>
            <TabsTrigger value="more-information">More Information</TabsTrigger>
          </TabsList>
          <TabsContent value="serial-and-batch-reservation" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sales Order">Sales Order</SelectItem>
                    <SelectItem value="Work Order">Work Order</SelectItem>
                    <SelectItem value="Subcontracting Inward Order">Subcontracting Inward Order</SelectItem>
                    <SelectItem value="Production Plan">Production Plan</SelectItem>
                    <SelectItem value="Subcontracting Order">Subcontracting Order</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_detail_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Detail No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="available_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Available Qty to Reserve</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reserved_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reserved Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="delivered_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delivered Qty</FormLabel>
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
          <CardTitle className="text-base">Item Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} disabled />
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
            <FormField control={form.control} name="stock_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().has_serial_no && (
            <FormField control={form.control} name="has_serial_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Serial No</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_batch_no && (
            <FormField control={form.control} name="has_batch_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Batch No</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="from_voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Voucher Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pick List">Pick List</SelectItem>
                    <SelectItem value="Purchase Receipt">Purchase Receipt</SelectItem>
                    <SelectItem value="Stock Entry">Stock Entry</SelectItem>
                    <SelectItem value="Work Order">Work Order</SelectItem>
                    <SelectItem value="Production Plan">Production Plan</SelectItem>
                    <SelectItem value="Subcontracting Inward Order">Subcontracting Inward Order</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_voucher_detail_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Voucher Detail No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="transferred_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transferred Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="consumed_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Consumed Qty</FormLabel>
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
            {parent.has_serial_no || parent.has_batch_no && (
            <FormField control={form.control} name="reservation_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reservation Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Qty">Qty</SelectItem>
                    <SelectItem value="Serial and Batch">Serial and Batch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().has_serial_no || form.getValues().has_batch_no) && form.getValues().reservation_based_on === "Serial && Batch" && (
            <div className="col-span-2">
              <FormLabel className="">sb_entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Serial and Batch Entry — integrate with DataTable */}
                <p>Child table for Serial and Batch Entry</p>
              </div>
            </div>
            )}
          </TabsContent>
          <TabsContent value="more-information" className="space-y-4">
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Partially Reserved">Partially Reserved</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Partially Delivered">Partially Delivered</SelectItem>
                    <SelectItem value="Partially Used">Partially Used</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Stock Reservation Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Stock Reservation Entry..." {...f} value={(f.value as string) ?? ""} disabled />
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
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}