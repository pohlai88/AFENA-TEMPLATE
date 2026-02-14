"use client";

// Form for BOM Creator
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BomCreator } from "../types/bom-creator.js";
import { BomCreatorInsertSchema } from "../types/bom-creator.js";

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

interface BomCreatorFormProps {
  initialData?: Partial<BomCreator>;
  onSubmit: (data: Partial<BomCreator>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BomCreatorForm({ initialData = {}, onSubmit, mode, isLoading }: BomCreatorFormProps) {
  const form = useForm<Partial<BomCreator>>({
    resolver: zodResolver(BomCreatorInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "BOM Creator" : "New BOM Creator"}
        </h2>
        <Tabs defaultValue="bom-tree" className="w-full">
          <TabsList>
            <TabsTrigger value="bom-tree">BOM Tree</TabsTrigger>
            <TabsTrigger value="final-product">Final Product</TabsTrigger>
            <TabsTrigger value="sub-assemblies-&-raw-materials">Sub Assemblies & Raw Materials</TabsTrigger>
            <TabsTrigger value="remarks">Remarks</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="bom-tree" className="space-y-4">
            <FormField control={form.control} name="bom_creator" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">bom_creator</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="final-product" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finished Good (→ Item)</FormLabel>
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
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
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
          <CardTitle className="text-base">Operations Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="routing" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Routing (→ Routing)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Routing..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="sub-assemblies-&-raw-materials" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="rm_cost_as_per" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate Of Materials Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Valuation Rate">Valuation Rate</SelectItem>
                    <SelectItem value="Last Purchase Rate">Last Purchase Rate</SelectItem>
                    <SelectItem value="Price List">Price List</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().rm_cost_as_per ==== "Valuation Rate" && (
            <FormField control={form.control} name="set_rate_based_on_warehouse" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Valuation Rate Based on Source Warehouse</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().rm_cost_as_per===="Price List" && (
            <FormField control={form.control} name="buying_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().rm_cost_as_per==='Price List' && (
            <FormField control={form.control} name="price_list_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().rm_cost_as_per==='Price List' && (
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
            )}
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
                <FormLabel className="">Conversion Rate</FormLabel>
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
          <CardTitle className="text-base">Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Source Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: BOM Creator Item — integrate with DataTable */}
                <p>Child table for BOM Creator Item</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="raw_material_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Cost</FormLabel>
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
          </TabsContent>
          <TabsContent value="remarks" className="space-y-4">
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="error_log" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Error Log</FormLabel>
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
          <TabsContent value="connections" className="space-y-4">
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ BOM Creator)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM Creator..." {...f} value={(f.value as string) ?? ""} disabled />
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