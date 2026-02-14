"use client";

// Form for Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PurchaseInvoice } from "../types/purchase-invoice.js";
import { PurchaseInvoiceInsertSchema } from "../types/purchase-invoice.js";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseInvoiceFormProps {
  initialData?: Partial<PurchaseInvoice>;
  onSubmit: (data: Partial<PurchaseInvoice>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PurchaseInvoiceForm({ initialData = {}, onSubmit, mode, isLoading }: PurchaseInvoiceFormProps) {
  const form = useForm<Partial<PurchaseInvoice>>({
    resolver: zodResolver(PurchaseInvoiceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Purchase Invoice" : "New Purchase Invoice"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="address-&-contact">Address & Contact</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="more-info">More Info</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="payments" className="space-y-4">
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().supplier && (
            <FormField control={form.control} name="supplier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Supplier Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="tax_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Id</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus===0 && (
            <FormField control={form.control} name="set_posting_time" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Edit Posting Date and Time</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="due_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_paid" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Paid</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_return" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Return (Debit Note)</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().return_against && (
            <FormField control={form.control} name="return_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Return Against Purchase Invoice (→ Purchase Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().is_return && form.getValues().return_against && (
            <FormField control={form.control} name="update_outstanding_for_self" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Outstanding for Self</FormLabel>
                  <FormDescription>Debit Note will update it's own outstanding amount, even if 'Return Against' is specified.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_return && (
            <FormField control={form.control} name="update_billed_amount_in_purchase_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Billed Amount in Purchase Order</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_return && (
            <FormField control={form.control} name="update_billed_amount_in_purchase_receipt" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Billed Amount in Purchase Receipt</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
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
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Purchase Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="bill_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Invoice No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bill_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Dimensions </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currency and Price List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="conversion_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="use_transaction_date_exchange_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Transaction Date Exchange Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="buying_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="price_list_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="plc_conversion_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_pricing_rule" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Pricing Rule</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="scan_barcode" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Scan Barcode</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().last_scanned_warehouse && (
            <FormField control={form.control} name="last_scanned_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Last Scanned Warehouse</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().items.every((item) => !item.pr_detail) && (
            <FormField control={form.control} name="update_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Stock</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().update_stock && (
            <FormField control={form.control} name="set_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Set Accepted Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().update_stock && form.getValues().is_internal_supplier && (
            <FormField control={form.control} name="set_from_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Set From Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_subcontracted" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Subcontracted</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().update_stock && (
            <FormField control={form.control} name="rejected_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rejected Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_subcontracted && (
            <FormField control={form.control} name="supplier_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
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
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Purchase Invoice Item — integrate with DataTable */}
                <p>Child table for Purchase Invoice Item</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="total_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().total_net_weight && (
            <FormField control={form.control} name="total_net_weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Net Weight</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="base_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_net_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Total (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="claimed_landed_cost_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Claimed Landed Cost Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="net_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Total</FormLabel>
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
          <CardTitle className="text-base">Taxes and Charges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="tax_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Category (→ Tax Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="taxes_and_charges" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Taxes and Charges Template (→ Purchase Taxes and Charges Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Taxes and Charges Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipping_rule" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shipping Rule (→ Shipping Rule)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Shipping Rule..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="incoterm" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Incoterm (→ Incoterm)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Incoterm..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().incoterm && (
            <FormField control={form.control} name="named_place" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Named Place</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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
            <div className="col-span-2">
              <FormLabel className="">Purchase Taxes and Charges</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Purchase Taxes and Charges — integrate with DataTable */}
                <p>Child table for Purchase Taxes and Charges</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="base_taxes_and_charges_added" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Taxes and Charges Added (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_taxes_and_charges_deducted" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Taxes and Charges Deducted (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_total_taxes_and_charges" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Taxes and Charges (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="taxes_and_charges_added" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Taxes and Charges Added</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="taxes_and_charges_deducted" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Taxes and Charges Deducted</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_taxes_and_charges" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Taxes and Charges</FormLabel>
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
          <CardTitle className="text-base">Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="grand_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Grand Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().grand_total && (
            <FormField control={form.control} name="disable_rounded_total" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Rounded Total</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!form.getValues().disable_rounded_total && (
            <FormField control={form.control} name="rounding_adjustment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rounding Adjustment</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="use_company_roundoff_cost_center" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Company Default Round Off Cost Center</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="in_words" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">In Words</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().disable_rounded_total && (
            <FormField control={form.control} name="rounded_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rounded Total</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Totals (Company Currency)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="base_grand_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Grand Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().disable_rounded_total && (
            <FormField control={form.control} name="base_rounding_adjustment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rounding Adjustment</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="base_in_words" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">In Words</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().disable_rounded_total && (
            <FormField control={form.control} name="base_rounded_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rounded Total</FormLabel>
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
            <FormField control={form.control} name="total_advance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Advance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="outstanding_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding Amount</FormLabel>
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
          <CardTitle className="text-base">Tax Withholding Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="tax_withholding_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Group (→ Tax Withholding Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_tax_withholding_threshold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Tax Withholding Threshold</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="override_tax_withholding_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Edit Tax Withholding Entries</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Tax Withholding Entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Tax Withholding Entry — integrate with DataTable */}
                <p>Child table for Tax Withholding Entry</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="apply_discount_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply Additional Discount On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Grand Total">Grand Total</SelectItem>
                    <SelectItem value="Net Total">Net Total</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_discount_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Discount Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="additional_discount_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Discount Percentage</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discount_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Discount Amount</FormLabel>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Breakup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="other_charges_calculation" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Taxes and Charges Calculation</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Pricing Rule Detail</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Detail — integrate with DataTable */}
                <p>Child table for Pricing Rule Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw Materials Supplied</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().update_stock && (
            <div className="col-span-2">
              <FormLabel className="">Supplied Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Purchase Receipt Item Supplied — integrate with DataTable */}
                <p>Child table for Purchase Receipt Item Supplied</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment (→ Mode of Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Mode of Payment..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_paid_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Paid Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="clearance_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Clearance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cash_bank_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cash/Bank Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_paid && (
            <FormField control={form.control} name="paid_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Paid Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
          <CardTitle className="text-base">Advance Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allocate_advances_automatically" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Advances and Allocate (FIFO)</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().allocate_advances_automatically && (
            <FormField control={form.control} name="only_include_allocated_payments" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Only Include Allocated Payments</FormLabel>
                  <FormDescription>Advance payments allocated against orders will only be fetched</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            <div className="col-span-2">
              <FormLabel className="">Advances</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Purchase Invoice Advance — integrate with DataTable */}
                <p>Child table for Purchase Invoice Advance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Write Off</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="write_off_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_write_off_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {flt(form.getValues().write_off_amount)!==0 && (
            <FormField control={form.control} name="write_off_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {flt(form.getValues().write_off_amount)!==0 && (
            <FormField control={form.control} name="write_off_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Cost Center (→ Cost Center)</FormLabel>
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
          </TabsContent>
          <TabsContent value="address-&-contact" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="supplier_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select Supplier Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Person (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_mobile" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Mobile No</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_email" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact Email</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="dispatch_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select Dispatch Address  (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dispatch_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Dispatch Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipping_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select Shipping Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipping_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Shipping Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billing_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select Billing Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="billing_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Billing Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="terms" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {(!form.getValues().is_paid && !form.getValues().is_return) && (
            <FormField control={form.control} name="payment_terms_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Terms Template (→ Payment Terms Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Terms Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(!form.getValues().is_paid && !form.getValues().is_return) && (
            <div className="col-span-2">
              <FormLabel className="">Payment Schedule</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Payment Schedule — integrate with DataTable */}
                <p>Child table for Payment Schedule</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="tc_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Terms (→ Terms and Conditions)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Terms and Conditions..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="terms" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Terms and Conditions</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="more-info" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Debit Note Issued">Debit Note Issued</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partly Paid">Partly Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Internal Transfer">Internal Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="credit_to" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Credit To (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_opening" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Opening Entry</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_internal_supplier && (
            <FormField control={form.control} name="unrealized_profit_loss_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Unrealized Profit / Loss Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Unrealized Profit/Loss account for intra-company transfers</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="subscription" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subscription (→ Subscription)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subscription..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_repeat" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Auto Repeat (→ Auto Repeat)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Auto Repeat..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Start date of current invoice's period</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>End date of current invoice's period</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Print Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="letter_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Letter Head (→ Letter Head)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Letter Head..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="group_same_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Group same items</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="select_print_heading" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Heading (→ Print Heading)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Print Heading..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="language" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Language</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Hold Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="on_hold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Hold Invoice</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().on_hold && (
            <FormField control={form.control} name="release_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Once set, this invoice will be on hold till the set date</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().on_hold && (
            <FormField control={form.control} name="hold_comment" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Reason For Putting On Hold</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Additional Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="is_internal_supplier" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Internal Supplier</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().is_internal_supplier && (
            <FormField control={form.control} name="represents_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Represents Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Company which internal supplier represents</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="supplier_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Group (→ Supplier Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sender" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sender</FormLabel>
                <FormControl>
                  <Input type="email" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="inter_company_invoice_reference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Inter Company Invoice Reference (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="connections" className="space-y-4">

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