"use client";

// Form for Subcontracting Order
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubcontractingOrder } from "../types/subcontracting-order.js";
import { SubcontractingOrderInsertSchema } from "../types/subcontracting-order.js";

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

interface SubcontractingOrderFormProps {
  initialData?: Partial<SubcontractingOrder>;
  onSubmit: (data: Partial<SubcontractingOrder>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubcontractingOrderForm({ initialData = {}, onSubmit, mode, isLoading }: SubcontractingOrderFormProps) {
  const form = useForm<Partial<SubcontractingOrder>>({
    resolver: zodResolver(SubcontractingOrderInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.supplier_name as string) ?? "Subcontracting Order" : "New Subcontracting Order"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="address-and-contact" className="w-full">
          <TabsList>
            <TabsTrigger value="address-and-contact">Address and Contact</TabsTrigger>
            <TabsTrigger value="additional-costs">Additional Costs</TabsTrigger>
            <TabsTrigger value="other-info">Other Info</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="address-and-contact" className="space-y-4">
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
            <FormField control={form.control} name="purchase_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subcontracting Purchase Order (→ Purchase Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Order..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Job Worker (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Job Worker Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().supplier && (
            <FormField control={form.control} name="supplier_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Worker Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transaction_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="schedule_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Required By</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Subcontracting Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subcontracting Order..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Dimensions</CardTitle>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().purchase_order && (
            <FormField control={form.control} name="set_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Set Target Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Sets 'Warehouse' in each row of the Items table.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().purchase_order && (
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Subcontracting Order Item — integrate with DataTable */}
                <p>Child table for Subcontracting Order Item</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().purchase_order && (
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
            )}
            {!!form.getValues().purchase_order && (
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
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Service Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Subcontracting Order Service Item — integrate with DataTable */}
                <p>Child table for Subcontracting Order Service Item</p>
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
            {!!form.getValues().supplied_items && (
            <FormField control={form.control} name="set_reserve_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Set Reserve Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Sets 'Reserve Warehouse' in each row of the Supplied Items table.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="reserve_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Reserve Stock</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Supplied Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Subcontracting Order Supplied Item — integrate with DataTable */}
                <p>Child table for Subcontracting Order Supplied Item</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
            <FormField control={form.control} name="supplier_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Worker Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Job Worker Address Details</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Worker Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact Name</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_mobile" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact Mobile No</FormLabel>
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
            <FormField control={form.control} name="shipping_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company Shipping Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipping_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Shipping Address Details</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="billing_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company Billing Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="billing_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Billing Address Details</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="additional-costs" className="space-y-4">
            <FormField control={form.control} name="distribute_additional_costs_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Distribute Additional Costs Based On </FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Qty">Qty</SelectItem>
                    <SelectItem value="Amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Additional Costs</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Landed Cost Taxes and Charges — integrate with DataTable */}
                <p>Child table for Landed Cost Taxes and Charges</p>
              </div>
            </div>
            <FormField control={form.control} name="total_additional_costs" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Additional Costs</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="other-info" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Status</CardTitle>
        </CardHeader>
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Partially Received">Partially Received</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Material Transferred">Material Transferred</SelectItem>
                    <SelectItem value="Partial Material Transferred">Partial Material Transferred</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="per_received" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">% Received</FormLabel>
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
          <CardTitle className="text-base">Printing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="select_print_heading" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Heading (→ Print Heading)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Print Heading..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="letter_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Letter Head (→ Letter Head)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Letter Head..." {...f} value={(f.value as string) ?? ""} />
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