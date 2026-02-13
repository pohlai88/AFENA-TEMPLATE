"use client";

// Form for Pricing Rule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingRule } from "../types/pricing-rule.js";
import { PricingRuleInsertSchema } from "../types/pricing-rule.js";

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

interface PricingRuleFormProps {
  initialData?: Partial<PricingRule>;
  onSubmit: (data: Partial<PricingRule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PricingRuleForm({ initialData = {}, onSubmit, mode, isLoading }: PricingRuleFormProps) {
  const form = useForm<Partial<PricingRule>>({
    resolver: zodResolver(PricingRuleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Pricing Rule" : "New Pricing Rule"}
          </h2>
        </div>
        <Tabs defaultValue="dynamic-condition" className="w-full">
          <TabsList>
            <TabsTrigger value="dynamic-condition">Dynamic Condition</TabsTrigger>
            <TabsTrigger value="advanced-settings">Advanced Settings</TabsTrigger>
            <TabsTrigger value="help-article">Help Article</TabsTrigger>
          </TabsList>
          <TabsContent value="dynamic-condition" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Naming Series</FormLabel>
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
            <FormField control={form.control} name="title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disable" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="apply_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Item Code">Item Code</SelectItem>
                    <SelectItem value="Item Group">Item Group</SelectItem>
                    <SelectItem value="Brand">Brand</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="price_or_product_discount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price or Product Discount</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Price">Price</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().apply_on !== 'Transaction' && (
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().apply_on === 'Item Code' && (
            <div className="col-span-2">
              <FormLabel className="">Apply Rule On Item Code</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Item Code — integrate with DataTable */}
                <p>Child table for Pricing Rule Item Code</p>
              </div>
            </div>
            )}
            {form.getValues().apply_on === 'Item Group' && (
            <div className="col-span-2">
              <FormLabel className="">Apply Rule On Item Group</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Item Group — integrate with DataTable */}
                <p>Child table for Pricing Rule Item Group</p>
              </div>
            </div>
            )}
            {form.getValues().apply_on === 'Brand' && (
            <div className="col-span-2">
              <FormLabel className="">Apply Rule On Brand</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Brand — integrate with DataTable */}
                <p>Child table for Pricing Rule Brand</p>
              </div>
            </div>
            )}
            {form.getValues().apply_on !== 'Transaction' && (
            <FormField control={form.control} name="mixed_conditions" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Mixed Conditions</FormLabel>
                  <FormDescription>Conditions will be applied on all the selected items combined. </FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().apply_on !== 'Transaction' && (
            <FormField control={form.control} name="is_cumulative" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Cumulative</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="coupon_code_based" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Coupon Code Based</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discount on Other Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="apply_rule_on_other" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply Rule On Other</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Item Code">Item Code</SelectItem>
                    <SelectItem value="Item Group">Item Group</SelectItem>
                    <SelectItem value="Brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().apply_rule_on_other === 'Item Code' && (
            <FormField control={form.control} name="other_item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().apply_rule_on_other === 'Item Group' && (
            <FormField control={form.control} name="other_item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().apply_rule_on_other === 'Brand' && (
            <FormField control={form.control} name="other_brand" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Brand (→ Brand)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Brand..." {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Party Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="selling" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Selling</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="buying" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Buying</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().buying || form.getValues().selling && (
            <FormField control={form.control} name="applicable_for" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Applicable For</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Customer Group">Customer Group</SelectItem>
                    <SelectItem value="Territory">Territory</SelectItem>
                    <SelectItem value="Sales Partner">Sales Partner</SelectItem>
                    <SelectItem value="Campaign">Campaign</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Supplier Group">Supplier Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Customer" && (
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
            {form.getValues().applicable_for==="Customer Group" && (
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Territory" && (
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Sales Partner" && (
            <FormField control={form.control} name="sales_partner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner (→ Sales Partner)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Partner..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Campaign" && (
            <FormField control={form.control} name="campaign" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Campaign (→ UTM Campaign)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UTM Campaign..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Supplier" && (
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_for==="Supplier Group" && (
            <FormField control={form.control} name="supplier_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Group (→ Supplier Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Group..." {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Quantity and Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="min_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Min Qty (As Per Stock UOM)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="max_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Qty (As Per Stock UOM)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="min_amt" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Min Amt</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="max_amt" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Amt</FormLabel>
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
          <CardTitle className="text-base">Product Discount Scheme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().mixed_conditions && form.getValues().apply_on !== 'Transaction' && (
            <FormField control={form.control} name="same_item" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Same Item</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {(!form.getValues().same_item || form.getValues().apply_on === 'Transaction') || form.getValues().mixed_conditions && (
            <FormField control={form.control} name="free_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Free Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="free_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="free_item_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Free Item Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>If rate is zero then item will be treated as &quot;Free Item&quot;</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="free_item_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="round_free_qty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Round Free Qty</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().price_or_product_discount === 'Product' && (
            <FormField control={form.control} name="dont_enforce_free_item_qty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Don't Enforce Free Item Qty</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_recursive" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Recursive</FormLabel>
                  <FormDescription>Discounts to be applied in sequential ranges like buy 1 get 1, buy 2 get 2, buy 3 get 3 and so on</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().is_recursive && (
            <FormField control={form.control} name="recurse_for" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Recurse Every (As Per Transaction UOM)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Give free item for every N quantity</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().is_recursive && (
            <FormField control={form.control} name="apply_recursion_over" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply Recursion Over (As Per Transaction UOM)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Qty for which recursion isn't applicable.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Period Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="valid_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valid_upto" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid Up To</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            {!!form.getValues().margin_type && (
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Discount Scheme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="rate_or_discount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate or Discount</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Rate">Rate</SelectItem>
                    <SelectItem value="Discount Percentage">Discount Percentage</SelectItem>
                    <SelectItem value="Discount Amount">Discount Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().apply_on === 'Transaction' && form.getValues().rate_or_discount !== 'Rate' && (
            <FormField control={form.control} name="apply_discount_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply Discount On</FormLabel>
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
            )}
            {form.getValues().rate_or_discount==="Rate" && (
            <FormField control={form.control} name="rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().rate_or_discount==="Discount Amount" && (
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
            {form.getValues().rate_or_discount==="Discount Percentage" && (
            <FormField control={form.control} name="discount_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Percentage</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().rate_or_discount!=="Rate" && (
            <FormField control={form.control} name="for_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">For Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
            <FormField control={form.control} name="condition" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Condition</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Simple Python Expression, Example: territory != 'All Territories'</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="advanced-settings" className="space-y-4">
            <FormField control={form.control} name="apply_multiple_pricing_rules" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply Multiple Pricing Rules</FormLabel>
                </div>
              </FormItem>
            )} />
            {in_list(['Discount Percentage'], form.getValues().rate_or_discount) && form.getValues().apply_multiple_pricing_rules && (
            <FormField control={form.control} name="apply_discount_on_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply Discount on Discounted Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="threshold_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Threshold for Suggestion (In Percentage)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>System will notify to increase or decrease quantity or amount </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validate Pricing Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().price_or_product_discount === 'Price' && (
            <FormField control={form.control} name="validate_applied_rule" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Applied Rule</FormLabel>
                  <FormDescription>If enabled, then system will only validate the pricing rule and not apply automatically. User has to manually set the discount percentage / margin / free items to validate the pricing rule</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().validate_applied_rule && (
            <FormField control={form.control} name="rule_description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Rule Description</FormLabel>
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
          <CardTitle className="text-base">Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="has_priority" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Priority</FormLabel>
                  <FormDescription>Enable this checkbox even if you want to set the zero priority</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().has_priority && (
            <FormField control={form.control} name="priority" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Priority</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="17">17</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="19">19</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Higher the number, higher the priority</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="help-article" className="space-y-4">
            <FormField control={form.control} name="pricing_rule_help" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Pricing Rule Help</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="promotional_scheme" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Promotional Scheme (→ Promotional Scheme)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Promotional Scheme..." {...f} value={(f.value as string) ?? ""} disabled />
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