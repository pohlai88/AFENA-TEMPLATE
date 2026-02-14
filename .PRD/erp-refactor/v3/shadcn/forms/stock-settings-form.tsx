"use client";

// Form for Stock Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockSettings } from "../types/stock-settings.js";
import { StockSettingsInsertSchema } from "../types/stock-settings.js";

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

interface StockSettingsFormProps {
  initialData?: Partial<StockSettings>;
  onSubmit: (data: Partial<StockSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function StockSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: StockSettingsFormProps) {
  const form = useForm<Partial<StockSettings>>({
    resolver: zodResolver(StockSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Stock Settings" : "New Stock Settings"}
        </h2>
        <Tabs defaultValue="defaults" className="w-full">
          <TabsList>
            <TabsTrigger value="defaults">Defaults</TabsTrigger>
            <TabsTrigger value="stock-validations">Stock Validations</TabsTrigger>
            <TabsTrigger value="serial-&-batch-item">Serial & Batch Item</TabsTrigger>
            <TabsTrigger value="stock-reservation">Stock Reservation</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="stock-planning">Stock Planning</TabsTrigger>
            <TabsTrigger value="stock-closing">Stock Closing</TabsTrigger>
          </TabsList>
          <TabsContent value="defaults" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="item_naming_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Naming By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Item Code">Item Code</SelectItem>
                    <SelectItem value="Naming Series">Naming Series</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valuation_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Valuation Method</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO</SelectItem>
                    <SelectItem value="Moving Average">Moving Average</SelectItem>
                    <SelectItem value="LIFO">LIFO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sample_retention_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sample Retention Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Stock UOM (→ UOM)</FormLabel>
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
          <CardTitle className="text-base">Price List Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_insert_price_list_rate_if_missing" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Insert Item Price If Missing</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().auto_insert_price_list_rate_if_missing && (
            <FormField control={form.control} name="update_price_list_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Update Price List Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Rate">Rate</SelectItem>
                    <SelectItem value="Price List Rate">Price List Rate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().auto_insert_price_list_rate_if_missing && (
            <FormField control={form.control} name="update_existing_price_list_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Existing Price List Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock UOM Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_to_edit_stock_uom_qty_for_sales" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow to Edit Stock UOM Qty for Sales Documents</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_to_edit_stock_uom_qty_for_purchase" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow to Edit Stock UOM Qty for Purchase Documents</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_uom_with_conversion_rate_defined_in_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow UOM with Conversion Rate Defined in Item</FormLabel>
                  <FormDescription>If enabled, the system will allow selecting UOMs in sales and purchase transactions only if the conversion rate is set in the item master.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="stock-validations" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Transactions Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="over_delivery_receipt_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Delivery/Receipt Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>The percentage you are allowed to receive or deliver more against the quantity ordered. For example, if you have ordered 100 units, and your Allowance is 10%, then you are allowed to receive 110 units.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mr_qty_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Transfer Allowance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>The percentage you are allowed to transfer more against the quantity ordered. For example, if you have ordered 100 units, and your Allowance is 10%, then you are allowed transfer 110 units.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="over_picking_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Picking Allowance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>The percentage you are allowed to pick more items in the pick list than the ordered quantity.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role_allowed_to_over_deliver_receive" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Over Deliver/Receive (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Users with this role are allowed to over deliver/receive against orders above the allowance percentage</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_negative_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Negative Stock</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="show_barcode_field" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Barcode Field in Stock Transactions</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="clean_description_html" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Convert Item Description to Clean HTML in Transactions</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_internal_transfer_at_arms_length_price" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Internal Transfers at Arm's Length Price</FormLabel>
                  <FormDescription>If enabled, the item rate won't adjust to the valuation rate during internal transfers, but accounting will still use the valuation rate.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="validate_material_transfer_warehouses" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Material Transfer Warehouses</FormLabel>
                  <FormDescription>If enabled, the source and target warehouse in the Material Transfer Stock Entry must be different else an error will be thrown. If inventory dimensions are present, same source and target warehouse can be allowed but atleast any one of the inventory dimension fields must be different.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="serial-&-batch-item" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Serial & Batch Item Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_existing_serial_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow existing Serial No to be Manufactured/Received again</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="do_not_use_batchwise_valuation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Do Not Use Batch-wise Valuation</FormLabel>
                  <FormDescription>If enabled, the system will use the moving average valuation method to calculate the valuation rate for the batched items and will not consider the individual batch-wise incoming rate.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_create_serial_and_batch_bundle_for_outward" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Create Serial and Batch Bundle For Outward</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().auto_create_serial_and_batch_bundle_for_outward && (
            <FormField control={form.control} name="pick_serial_and_batch_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pick Serial / Batch Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO</SelectItem>
                    <SelectItem value="LIFO">LIFO</SelectItem>
                    <SelectItem value="Expiry">Expiry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="disable_serial_no_and_batch_selector" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Serial No And Batch Selector</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="use_serial_batch_fields" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Serial / Batch Fields</FormLabel>
                  <FormDescription>On submission of the stock transaction, system will auto create the Serial and Batch Bundle based on the Serial No / Batch fields.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="do_not_update_serial_batch_on_creation_of_auto_bundle" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Do Not Update Serial / Batch on Creation of Auto Bundle</FormLabel>
                  <FormDescription>If enabled, do not update serial / batch values in the stock transactions on creation of auto Serial 
 / Batch Bundle. </FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Serial and Batch Bundle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="set_serial_and_batch_bundle_naming_based_on_naming_series" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Serial and Batch Bundle Naming Based on Naming Series</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="use_naming_series" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Have Default Naming Series for Batch ID?</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().use_naming_series===1 && (
            <FormField control={form.control} name="naming_series_prefix" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Naming Series Prefix</FormLabel>
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
          </TabsContent>
          <TabsContent value="stock-reservation" className="space-y-4">
            <FormField control={form.control} name="enable_stock_reservation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Stock Reservation</FormLabel>
                  <FormDescription>Allows to keep aside a specific quantity of inventory for a particular order.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_reserve_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Reserve Stock</FormLabel>
                  <FormDescription>Upon submission of the Sales Order, Work Order, or Production Plan, the system will automatically reserve the stock.</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().enable_stock_reservation && (
            <FormField control={form.control} name="allow_partial_reservation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Partial Reservation</FormLabel>
                  <FormDescription>Partial stock can be reserved. For example, If you have a Sales Order of 100 units and the Available Stock is 90 units then a Stock Reservation Entry will be created for 90 units. </FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().enable_stock_reservation && (
            <FormField control={form.control} name="auto_reserve_stock_for_sales_order_on_purchase" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Reserve Stock for Sales Order on Purchase</FormLabel>
                  <FormDescription>Stock will be reserved on submission of &lt;b&gt;Purchase Receipt&lt;/b&gt; created against Material Request for Sales Order.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Serial and Batch Reservation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().enable_stock_reservation && (
            <FormField control={form.control} name="auto_reserve_serial_and_batch" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Reserve Serial and Batch Nos</FormLabel>
                  <FormDescription>Serial and Batch Nos will be auto-reserved based on &lt;b&gt;Pick Serial / Batch Based On&lt;/b&gt;</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="quality" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quality Inspection Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="action_if_quality_inspection_is_not_submitted" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action If Quality Inspection Is Not Submitted</FormLabel>
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
            <FormField control={form.control} name="action_if_quality_inspection_is_rejected" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action If Quality Inspection Is Rejected</FormLabel>
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_to_make_quality_inspection_after_purchase_or_delivery" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow to Make Quality Inspection after Purchase / Delivery</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="stock-planning" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto Material Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_indent" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Raise Material Request When Stock Reaches Re-order Level</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="reorder_email_notify" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Notify by Email on Creation of Automatic Material Request</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inter Warehouse Transfer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_from_dn" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Material Transfer from Delivery Note to Sales Invoice</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_from_pr" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Material Transfer from Purchase Receipt to Purchase Invoice</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="stock-closing" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control Historical Stock Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="stock_frozen_upto" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Frozen Up To</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>No stock transactions can be created or modified before this date.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_frozen_upto_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Freeze Stocks Older Than (Days)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Stock transactions that are older than the mentioned days cannot be modified.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role_allowed_to_create_edit_back_dated_transactions" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Create/Edit Back-dated Transactions (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>If mentioned, the system will allow only the users with this Role to create or modify any stock transaction earlier than the latest stock transaction for a specific item and warehouse. If set as blank, it allows all users to create/edit back-dated transactions.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {(form.getValues().stock_frozen_upto || form.getValues().stock_frozen_upto_days) && (
            <FormField control={form.control} name="stock_auth_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Edit Frozen Stock (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>The users with this Role are allowed to create/modify a stock transaction, even though the transaction is frozen.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
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