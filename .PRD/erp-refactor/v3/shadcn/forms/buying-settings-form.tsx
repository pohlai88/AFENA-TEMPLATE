"use client";

// Form for Buying Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BuyingSettings } from "../types/buying-settings.js";
import { BuyingSettingsInsertSchema } from "../types/buying-settings.js";

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

interface BuyingSettingsFormProps {
  initialData?: Partial<BuyingSettings>;
  onSubmit: (data: Partial<BuyingSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BuyingSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: BuyingSettingsFormProps) {
  const form = useForm<Partial<BuyingSettings>>({
    resolver: zodResolver(BuyingSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Buying Settings" : "New Buying Settings"}
        </h2>
        <Tabs defaultValue="naming-series-and-price-defaults" className="w-full">
          <TabsList>
            <TabsTrigger value="naming-series-and-price-defaults">Naming Series and Price Defaults</TabsTrigger>
            <TabsTrigger value="transaction-settings">Transaction Settings</TabsTrigger>
            <TabsTrigger value="subcontracting-settings">Subcontracting Settings</TabsTrigger>
            <TabsTrigger value="request-for-quotation">Request for Quotation</TabsTrigger>
          </TabsList>
          <TabsContent value="naming-series-and-price-defaults" className="space-y-4">
            <FormField control={form.control} name="supp_master_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Naming By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Supplier Name">Supplier Name</SelectItem>
                    <SelectItem value="Naming Series">Naming Series</SelectItem>
                    <SelectItem value="Auto Name">Auto Name</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Supplier Group (→ Supplier Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="buying_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Buying Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().maintain_same_rate && (
            <FormField control={form.control} name="maintain_same_rate_action" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action If Same Rate is Not Maintained</FormLabel>
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
                <FormDescription>Configure the action to stop the transaction or just warn if the same rate is not maintained.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().maintain_same_rate_action === 'Stop' && (
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
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="po_required" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Purchase Order Required for Purchase Invoice & Receipt Creation?</FormLabel>
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
            <FormField control={form.control} name="blanket_order_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Blanket Order Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Percentage you are allowed to order beyond the Blanket Order quantity.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pr_required" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Purchase Receipt Required for Purchase Invoice Creation?</FormLabel>
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
            <FormField control={form.control} name="project_update_frequency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Update frequency of Project</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Each Transaction">Each Transaction</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How often should Project be updated of Total Purchase Cost ?</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="transaction-settings" className="space-y-4">
            {!form.getValues().maintain_same_rate && (
            <FormField control={form.control} name="set_landed_cost_based_on_purchase_invoice_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Landed Cost Based on Purchase Invoice Rate</FormLabel>
                  <FormDescription>Users can enable the checkbox If they want to adjust the incoming rate (set using purchase receipt) based on the purchase invoice rate.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="allow_zero_qty_in_supplier_quotation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Supplier Quotation with Zero Quantity</FormLabel>
                  <FormDescription>Allows users to submit Supplier Quotations with zero quantity. Useful when rates are fixed but the quantities are not. Eg. Rate Contracts.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="use_transaction_date_exchange_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Transaction Date Exchange Rate</FormLabel>
                  <FormDescription>While making Purchase Invoice from Purchase Order, use Exchange Rate on Invoice's transaction date rather than inheriting it from Purchase Order. Only applies for Purchase Invoice.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_zero_qty_in_request_for_quotation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Request for Quotation with Zero Quantity</FormLabel>
                  <FormDescription>Allows users to submit Request for Quotations with zero quantity. Useful when rates are fixed but the quantities are not. Eg. Rate Contracts.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="maintain_same_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Maintain Same Rate Throughout the Purchase Cycle</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_multiple_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Item To Be Added Multiple Times in a Transaction</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="bill_for_rejected_quantity_in_purchase_invoice" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Bill for Rejected Quantity in Purchase Invoice</FormLabel>
                  <FormDescription>If checked, Rejected Quantity will be included while making Purchase Invoice from Purchase Receipt.</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().bill_for_rejected_quantity_in_purchase_invoice && (
            <FormField control={form.control} name="set_valuation_rate_for_rejected_materials" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Valuation Rate for Rejected Materials</FormLabel>
                  <FormDescription>If enabled, the system will generate an accounting entry for materials rejected in the Purchase Receipt.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="disable_last_purchase_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Last Purchase Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            {frappe.boot.versions && frappe.boot.versions.payments && (
            <FormField control={form.control} name="show_pay_button" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Pay Button in Purchase Order Portal</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="allow_zero_qty_in_purchase_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Purchase Order with Zero Quantity</FormLabel>
                  <FormDescription>Allows users to submit Purchase Orders with zero quantity. Useful when rates are fixed but the quantities are not. Eg. Rate Contracts.</FormDescription>
                </div>
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="subcontracting-settings" className="space-y-4">
            <FormField control={form.control} name="backflush_raw_materials_of_subcontract_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Backflush Raw Materials of Subcontract Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BOM">BOM</SelectItem>
                    <SelectItem value="Material Transferred for Subcontract">Material Transferred for Subcontract</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().backflush_raw_materials_of_subcontract_based_on === "BOM" && (
            <FormField control={form.control} name="over_transfer_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Transfer Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Percentage you are allowed to transfer more against the quantity ordered. For example: If you have ordered 100 units. and your Allowance is 10% then you are allowed to transfer 110 units.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().backflush_raw_materials_of_subcontract_based_on === "Material Transferred for Subcontract" && (
            <FormField control={form.control} name="validate_consumed_qty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Consumed Qty (as per BOM)</FormLabel>
                  <FormDescription>Raw materials consumed qty will be validated based on FG BOM required qty</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_create_subcontracting_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Create Subcontracting Order</FormLabel>
                  <FormDescription>Subcontracting Order (Draft) will be auto-created on submission of Purchase Order.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_create_purchase_receipt" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Create Purchase Receipt</FormLabel>
                  <FormDescription>Purchase Receipt (Draft) will be auto-created on submission of Subcontracting Receipt.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="request-for-quotation" className="space-y-4">
            <FormField control={form.control} name="fixed_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fixed Outgoing Email Account (→ Email Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Email Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>If set, the system does not use the user's Email or the standard outgoing Email account for sending request for quotations.</FormDescription>
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