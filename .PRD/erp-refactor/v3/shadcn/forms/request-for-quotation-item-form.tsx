"use client";

// Form for Request for Quotation Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RequestForQuotationItem } from "../types/request-for-quotation-item.js";
import { RequestForQuotationItemInsertSchema } from "../types/request-for-quotation-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequestForQuotationItemFormProps {
  initialData?: Partial<RequestForQuotationItem>;
  onSubmit: (data: Partial<RequestForQuotationItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RequestForQuotationItemForm({ initialData = {}, onSubmit, mode, isLoading }: RequestForQuotationItemFormProps) {
  const form = useForm<Partial<RequestForQuotationItem>>({
    resolver: zodResolver(RequestForQuotationItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Request for Quotation Item" : "New Request for Quotation Item"}
        </h2>
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="schedule_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Required Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="brand" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Brand (→ Brand)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Brand..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
          <CardTitle className="text-base">Quantity & Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
            <FormField control={form.control} name="stock_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qty as per Stock UOM</FormLabel>
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
          <CardTitle className="text-base">Warehouse and Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Accounting Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="project_name" render={({ field: f }) => (
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