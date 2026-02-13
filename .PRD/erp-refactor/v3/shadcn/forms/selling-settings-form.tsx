"use client";

// Form for Selling Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SellingSettings } from "../types/selling-settings.js";
import { SellingSettingsInsertSchema } from "../types/selling-settings.js";

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

interface SellingSettingsFormProps {
  initialData?: Partial<SellingSettings>;
  onSubmit: (data: Partial<SellingSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SellingSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: SellingSettingsFormProps) {
  const form = useForm<Partial<SellingSettings>>({
    resolver: zodResolver(SellingSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Selling Settings" : "New Selling Settings"}
        </h2>
        <Tabs defaultValue="item-price" className="w-full">
          <TabsList>
            <TabsTrigger value="item-price">Item Price</TabsTrigger>
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
            <TabsTrigger value="subcontracting-inward">Subcontracting Inward</TabsTrigger>
          </TabsList>
          <TabsContent value="item-price" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="cust_master_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Naming By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer Name">Customer Name</SelectItem>
                    <SelectItem value="Naming Series">Naming Series</SelectItem>
                    <SelectItem value="Auto Name">Auto Name</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item Price Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="selling_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().maintain_same_sales_rate && (
            <FormField control={form.control} name="maintain_same_rate_action" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Same Rate is Not Maintained Throughout Sales Cycle</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().maintain_same_sales_rate && form.getValues().maintain_same_rate_action === 'Stop' && (
            <FormField control={form.control} name="role_to_override_stop_action" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Override Stop Action (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="maintain_same_sales_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Maintain Same Rate Throughout Sales Cycle</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="fallback_to_default_price_list" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Prices from Default Price List as Fallback</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="editable_price_list_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow User to Edit Price List Rate in Transactions</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="validate_selling_price" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Selling Price for Item Against Purchase Rate or Valuation Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="editable_bundle_item_rates" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Calculate Product Bundle Price based on Child Items' Rates</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_negative_rates_for_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Negative rates for Items</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="transaction" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="so_required" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Sales Order Required for Sales Invoice & Delivery Note Creation?</FormLabel>
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
            <FormField control={form.control} name="dn_required" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Delivery Note Required for Sales Invoice Creation?</FormLabel>
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
            <FormField control={form.control} name="sales_update_frequency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Update Frequency in Company and Project</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Each Transaction">Each Transaction</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How often should Project and Company be updated based on Sales Transactions?</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="blanket_order_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Blanket Order Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Percentage you are allowed to sell beyond the Blanket Order quantity.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_tracking_sales_commissions" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable tracking sales commissions</FormLabel>
                  <FormDescription>Manage sales partner's and sales team's commissions</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_multiple_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Item to be Added Multiple Times in a Transaction</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_against_multiple_purchase_orders" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Multiple Sales Orders Against a Customer's Purchase Order</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_sales_order_creation_for_expired_quotation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Sales Order Creation For Expired Quotation</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="dont_reserve_sales_order_qty_on_sales_return" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Don't Reserve Sales Order Qty on Sales Return</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="hide_tax_id" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Hide Customer's Tax ID from Sales Transactions</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_discount_accounting" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Discount Accounting for Selling</FormLabel>
                  <FormDescription>If enabled, additional ledger entries will be made for discounts in a separate Discount Account</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_cutoff_date_on_bulk_delivery_note_creation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Cut-Off Date on Bulk Delivery Note Creation</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_zero_qty_in_quotation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Quotation with Zero Quantity</FormLabel>
                  <FormDescription>Allows users to submit Quotations with zero quantity. Useful when rates are fixed but the quantities are not. Eg. Rate Contracts.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_zero_qty_in_sales_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Sales Order with Zero Quantity</FormLabel>
                  <FormDescription>Allows users to submit Sales Orders with zero quantity. Useful when rates are fixed but the quantities are not. Eg. Rate Contracts.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="set_zero_rate_for_expired_batch" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Incoming Rate as Zero for Expired Batch</FormLabel>
                  <FormDescription>If enabled, system will set incoming rate as zero for stand-alone credit notes with expired batch item.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Experimental</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="use_legacy_js_reactivity" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Legacy (Client side) Reactivity</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="subcontracting-inward" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subcontracting Inward Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_delivery_of_overproduced_qty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Delivery of Overproduced Qty</FormLabel>
                  <FormDescription>If enabled, system will allow user to deliver the entire quantity of the finished goods produced against the Subcontracting Inward Order. If disabled, system will allow delivery of only the ordered quantity.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="deliver_scrap_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Deliver Scrap Items</FormLabel>
                  <FormDescription>If enabled, the Scrap Item generated against a Finished Good will also be added in the Stock Entry when delivering that Finished Good.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
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