"use client";

// Form for Promotional Scheme
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PromotionalScheme } from "../types/promotional-scheme.js";
import { PromotionalSchemeInsertSchema } from "../types/promotional-scheme.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromotionalSchemeFormProps {
  initialData?: Partial<PromotionalScheme>;
  onSubmit: (data: Partial<PromotionalScheme>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PromotionalSchemeForm({ initialData = {}, onSubmit, mode, isLoading }: PromotionalSchemeFormProps) {
  const form = useForm<Partial<PromotionalScheme>>({
    resolver: zodResolver(PromotionalSchemeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Promotional Scheme" : "New Promotional Scheme"}
        </h2>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            {form.getValues().apply_on === 'Item Code' && (
            <div className="col-span-2">
              <FormLabel className="">Pricing Rule Item Code</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Item Code — integrate with DataTable */}
                <p>Child table for Pricing Rule Item Code</p>
              </div>
            </div>
            )}
            {form.getValues().apply_on === 'Item Group' && (
            <div className="col-span-2">
              <FormLabel className="">Pricing Rule Item Group</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pricing Rule Item Group — integrate with DataTable */}
                <p>Child table for Pricing Rule Item Group</p>
              </div>
            </div>
            )}
            {form.getValues().apply_on === 'Brand' && (
            <div className="col-span-2">
              <FormLabel className="">Pricing Rule Brand</FormLabel>
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
            {form.getValues().applicable_for==='Customer' && (
            <div className="col-span-2">
              <FormLabel className="">Customer</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Customer Item — integrate with DataTable */}
                <p>Child table for Customer Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==="Customer Group" && (
            <div className="col-span-2">
              <FormLabel className="">Customer Group</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Customer Group Item — integrate with DataTable */}
                <p>Child table for Customer Group Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==="Territory" && (
            <div className="col-span-2">
              <FormLabel className="">Territory</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Territory Item — integrate with DataTable */}
                <p>Child table for Territory Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==="Sales Partner" && (
            <div className="col-span-2">
              <FormLabel className="">Sales Partner</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Sales Partner Item — integrate with DataTable */}
                <p>Child table for Sales Partner Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==="Campaign" && (
            <div className="col-span-2">
              <FormLabel className="">Campaign</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Campaign Item — integrate with DataTable */}
                <p>Child table for Campaign Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==='Supplier' && (
            <div className="col-span-2">
              <FormLabel className="">Supplier</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Supplier Item — integrate with DataTable */}
                <p>Child table for Supplier Item</p>
              </div>
            </div>
            )}
            {form.getValues().applicable_for==="Supplier Group" && (
            <div className="col-span-2">
              <FormLabel className="">Supplier Group</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Supplier Group Item — integrate with DataTable */}
                <p>Child table for Supplier Group Item</p>
              </div>
            </div>
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
          <CardTitle className="text-base">Price Discount Slabs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Promotional Scheme Price Discount</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Promotional Scheme Price Discount — integrate with DataTable */}
                <p>Child table for Promotional Scheme Price Discount</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Discount Slabs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Promotional Scheme Product Discount</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Promotional Scheme Product Discount — integrate with DataTable */}
                <p>Child table for Promotional Scheme Product Discount</p>
              </div>
            </div>
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