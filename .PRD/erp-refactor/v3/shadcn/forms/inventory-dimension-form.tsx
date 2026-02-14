"use client";

// Form for Inventory Dimension
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InventoryDimension } from "../types/inventory-dimension.js";
import { InventoryDimensionInsertSchema } from "../types/inventory-dimension.js";

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

interface InventoryDimensionFormProps {
  initialData?: Partial<InventoryDimension>;
  onSubmit: (data: Partial<InventoryDimension>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function InventoryDimensionForm({ initialData = {}, onSubmit, mode, isLoading }: InventoryDimensionFormProps) {
  const form = useForm<Partial<InventoryDimension>>({
    resolver: zodResolver(InventoryDimensionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Inventory Dimension" : "New Inventory Dimension"}
        </h2>
        <Tabs defaultValue="dimension-details" className="w-full">
          <TabsList>
            <TabsTrigger value="dimension-details">Dimension Details</TabsTrigger>
            <TabsTrigger value="applicable-for">Applicable For</TabsTrigger>
          </TabsList>
          <TabsContent value="dimension-details" className="space-y-4">
            <FormField control={form.control} name="dimension_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Dimension Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reference_document" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Document (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Field Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="source_fieldname" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source Fieldname</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="target_fieldname" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Fieldname (Stock Ledger Entry)</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="applicable-for" className="space-y-4">
            <FormField control={form.control} name="apply_to_all_doctypes" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply to All Inventory Documents</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="validate_negative_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Negative Stock</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().apply_to_all_doctypes && (
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply to Document (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().apply_to_all_doctypes && (
            <FormField control={form.control} name="type_of_transaction" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Type of Transaction</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Inward">Inward</SelectItem>
                    <SelectItem value="Outward">Outward</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="fetch_from_parent" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fetch Value From</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormDescription>Set fieldname from which you want to fetch the data from the parent form.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().apply_to_all_doctypes && (
            <FormField control={form.control} name="condition" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Conditional Rule</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Mandatory Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="reqd" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Mandatory</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="mandatory_depends_on" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Mandatory Depends On</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>To apply condition on parent field use parent.field_name and to apply condition on child table use doc.field_name. Here field_name could be based on the actual column name of the respective field.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conditional Rule Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="html_19" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">html_19</FormLabel>
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