"use client";

// Form for Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Item } from "../types/item.js";
import { ItemInsertSchema } from "../types/item.js";

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

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Partial<Item>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemForm({ initialData = {}, onSubmit, mode, isLoading }: ItemFormProps) {
  const form = useForm<Partial<Item>>({
    resolver: zodResolver(ItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.item_name as string) ?? "Item" : "New Item"}
          </h2>
        </div>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="defaults">Defaults</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
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
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Item Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Unit of Measure (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_alternative_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Alternative Item</FormLabel>
                </div>
              </FormItem>
            )} />
            {!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="is_stock_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-semibold">Maintain Stock</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!form.getValues().variant_of && (
            <FormField control={form.control} name="has_variants" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Variants</FormLabel>
                  <FormDescription>If this item has variants, then it cannot be selected in sales orders etc.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_fixed_asset" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Fixed Asset</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="auto_create_assets" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Create Assets on Purchase</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().auto_create_assets && (
            <FormField control={form.control} name="is_grouped_asset" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Create Grouped Asset</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="asset_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Category (→ Asset Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="asset_naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Naming Series</FormLabel>
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
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {(form.getValues().__islocal&&form.getValues().is_stock_item && !form.getValues().has_serial_no && !form.getValues().has_batch_no) && (
            <FormField control={form.control} name="opening_stock" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Opening Stock</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().__islocal && (
            <FormField control={form.control} name="standard_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Standard Selling Rate</FormLabel>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().__islocal && !form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="over_delivery_receipt_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Delivery/Receipt Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && !form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="over_billing_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Billing Allowance (%)</FormLabel>
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
            <FormField control={form.control} name="brand" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Brand (→ Brand)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Brand..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Units of Measure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">UOMs</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: UOM Conversion Detail — integrate with DataTable */}
                <p>Child table for UOM Conversion Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="dashboard" className="space-y-4">

          </TabsContent>
          <TabsContent value="inventory" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventory Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="valuation_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valuation Method</FormLabel>
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
            )}
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="valuation_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valuation Rate</FormLabel>
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
          <CardTitle className="text-base">Inventory Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="shelf_life_in_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shelf Life In Days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="end_of_life" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End of Life</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="default_material_request_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Material Request Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Material Transfer">Material Transfer</SelectItem>
                    <SelectItem value="Material Issue">Material Issue</SelectItem>
                    <SelectItem value="Manufacture">Manufacture</SelectItem>
                    <SelectItem value="Customer Provided">Customer Provided</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="warranty_period" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warranty Period (in days)</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_stock_item && (
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
            )}
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="weight_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Weight UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Barcodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Barcodes</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Barcode — integrate with DataTable */}
                <p>Child table for Item Barcode</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto re-order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Reorder level based on Warehouse</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Reorder — integrate with DataTable */}
                <p>Child table for Item Reorder</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Serial Nos and Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="has_batch_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Batch No</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_batch_no && (
            <FormField control={form.control} name="create_new_batch" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically Create New Batch</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().has_batch_no===1 && form.getValues().create_new_batch===1 && (
            <FormField control={form.control} name="batch_number_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Batch Number Series</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Example: ABCD.#####. If series is set and Batch No is not mentioned in transactions, then automatic batch number will be created based on this series. If you always want to explicitly mention Batch No for this item, leave this blank. Note: this setting will take priority over the Naming Series Prefix in Stock Settings.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_batch_no && (
            <FormField control={form.control} name="has_expiry_date" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Expiry Date</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_batch_no && (
            <FormField control={form.control} name="retain_sample" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Retain Sample</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {(form.getValues().retain_sample && form.getValues().has_batch_no) && (
            <FormField control={form.control} name="sample_quantity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Sample Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Maximum sample quantity that can be retained</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="has_serial_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Serial No</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_serial_no && (
            <FormField control={form.control} name="serial_no_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Serial Number Series</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Example: ABCD.#####
If series is set and Serial No is not mentioned in transactions, then automatic serial number will be created based on this series. If you always want to explicitly mention Serial Nos for this item. leave this blank.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="defaults" className="space-y-4">
            <div className="col-span-2">
              <FormLabel className="">Item Defaults</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Default — integrate with DataTable */}
                <p>Child table for Item Default</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="variants" className="space-y-4">
            {!!form.getValues().variant_of && (
            <FormField control={form.control} name="variant_of" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Variant Of (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormDescription>If item is a variant of another item then description, image, pricing, taxes etc will be set from the template unless explicitly specified</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().has_variants && (
            <FormField control={form.control} name="variant_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Variant Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Item Attribute">Item Attribute</SelectItem>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </TabsContent>
          <TabsContent value="accounting" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deferred Accounting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            <FormField control={form.control} name="no_of_months_exp" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Months (Expense)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="enable_deferred_revenue" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Deferred Revenue</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().enable_deferred_revenue && (
            <FormField control={form.control} name="no_of_months" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Months (Revenue)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="purchasing" className="space-y-4">
            <FormField control={form.control} name="purchase_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Purchase Unit of Measure (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_stock_item && (
            <FormField control={form.control} name="min_order_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Minimum Order Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Minimum quantity should be as per Stock UOM</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="safety_stock" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Safety Stock</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_purchase_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Purchase</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="lead_time_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lead Time in days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Average time taken by the supplier to deliver</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="last_purchase_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Last Purchase Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_customer_provided_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Customer Provided Item</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().is_customer_provided_item && (
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="delivered_by_supplier" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Delivered by Supplier (Drop Ship)</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Supplier Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Supplier — integrate with DataTable */}
                <p>Child table for Item Supplier</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foreign Trade Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="country_of_origin" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country of Origin (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customs_tariff_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customs Tariff Number (→ Customs Tariff Number)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customs Tariff Number..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="sales" className="space-y-4">
            <FormField control={form.control} name="sales_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Sales Unit of Measure (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="grant_commission" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Grant Commission</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_sales_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Sales</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="max_discount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Discount (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Customer Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Customer Detail — integrate with DataTable */}
                <p>Child table for Item Customer Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="tax" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Taxes</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Item Tax — integrate with DataTable */}
                <p>Child table for Item Tax</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().is_purchase_item && (
            <FormField control={form.control} name="purchase_tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_sales_item && (
            <FormField control={form.control} name="sales_tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="quality" className="space-y-4">
            <FormField control={form.control} name="inspection_required_before_purchase" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Inspection Required before Purchase</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="inspection_required_before_delivery" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Inspection Required before Delivery</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="quality_inspection_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quality Inspection Template (→ Quality Inspection Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Inspection Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="manufacturing" className="space-y-4">
            {!form.getValues().is_fixed_asset && (
            <FormField control={form.control} name="include_item_in_manufacturing" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include Item In Manufacturing</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_sub_contracted_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Subcontracted Item</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="default_bom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default BOM (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="production_capacity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Production Capacity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_manufacturer_part_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Manufacturer Part No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_item_manufacturer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Item Manufacturer (→ Manufacturer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Manufacturer..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
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