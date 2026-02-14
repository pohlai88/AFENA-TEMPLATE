"use client";

// Form for Work Order
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WorkOrder } from "../types/work-order.js";
import { WorkOrderInsertSchema } from "../types/work-order.js";

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

interface WorkOrderFormProps {
  initialData?: Partial<WorkOrder>;
  onSubmit: (data: Partial<WorkOrder>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WorkOrderForm({ initialData = {}, onSubmit, mode, isLoading }: WorkOrderFormProps) {
  const form = useForm<Partial<WorkOrder>>({
    resolver: zodResolver(WorkOrderInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.production_item as string) ?? "Work Order" : "New Work Order"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="production-item" className="w-full">
          <TabsList>
            <TabsTrigger value="production-item">Production Item</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="more-info">More Info</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="production-item" className="space-y-4">
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
            {!form.getValues().__islocal && (
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
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="Stock Reserved">Stock Reserved</SelectItem>
                    <SelectItem value="Stock Partially Reserved">Stock Partially Reserved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Stopped">Stopped</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="production_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item To Manufacture (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().production_item && (
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="bom_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">BOM No (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mps" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">MPS (→ Master Production Schedule)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Master Production Schedule..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().subcontracting_inward_order && (
            <FormField control={form.control} name="subcontracting_inward_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subcontracting Inward Order (→ Subcontracting Inward Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subcontracting Inward Order..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().subcontracting_inward_order && (
            <FormField control={form.control} name="sales_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Order (→ Sales Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Order..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qty To Manufacture</FormLabel>
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
            <FormField control={form.control} name="track_semi_finished_goods" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Track Semi Finished Goods</FormLabel>
                </div>
              </FormItem>
            )} />
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
            {form.getValues().docstatus===1 && form.getValues().skip_transfer===0 && form.getValues().track_semi_finished_goods ==== 0 && (
            <FormField control={form.control} name="material_transferred_for_manufacturing" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Material Transferred for Manufacturing</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="additional_transferred_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Transferred Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus===1 && (
            <FormField control={form.control} name="produced_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Manufactured Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().docstatus===1 && (
            <FormField control={form.control} name="disassembled_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Disassembled Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().process_loss_qty && (
            <FormField control={form.control} name="process_loss_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Process Loss Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="source_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This is a location where raw materials are available.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {!(form.getValues().skip_transfer && form.getValues().subcontracting_inward_order) && (
            <FormField control={form.control} name="wip_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Work-in-Progress Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This is a location where operations are executed.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="fg_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This is a location where final product stored.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="scrap_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Scrap Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This is a location where scraped materials are stored.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().operations?.length && form.getValues().track_semi_finished_goods ==== 0 && (
            <FormField control={form.control} name="transfer_material_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transfer Material Against</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Work Order">Work Order</SelectItem>
                    <SelectItem value="Job Card">Job Card</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <div className="col-span-2">
              <FormLabel className="">Operations</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Work Order Operation — integrate with DataTable */}
                <p>Child table for Work Order Operation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Required Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">required_items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Work Order Item — integrate with DataTable */}
                <p>Child table for Work Order Item</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="configuration" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().subcontracting_inward_order && (
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
            )}
            <FormField control={form.control} name="use_multi_level_bom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Multi-Level BOM</FormLabel>
                  <FormDescription>Plan material for sub-assemblies</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="skip_transfer" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Skip Material Transfer to WIP Warehouse</FormLabel>
                  <FormDescription>Check if material transfer entry is not required</FormDescription>
                </div>
              </FormItem>
            )} />
            {form.getValues().skip_transfer && !form.getValues().subcontracting_inward_order && (
            <FormField control={form.control} name="from_wip_warehouse" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Backflush Raw Materials From Work-in-Progress Warehouse</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="update_consumed_material_cost_in_project" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update Consumed Material Cost In Project</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="planned_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Planned Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="planned_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Planned End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expected_delivery_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expected Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="actual_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="actual_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lead_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lead Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>In Mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Operation Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="planned_operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Planned Operating Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="actual_operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual Operating Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="additional_operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Operating Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="corrective_operation_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Corrective Operation Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>From Corrective Job Card</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Operating Cost</FormLabel>
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
          <CardTitle className="text-base">Finished Good Serial / Batch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="has_serial_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Serial No</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="has_batch_no" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Has Batch No</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().has_batch_no && (
            <FormField control={form.control} name="batch_size" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Batch Size</FormLabel>
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
          </TabsContent>
          <TabsContent value="more-info" className="space-y-4">
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Item Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
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
            {!form.getValues().subcontracting_inward_order && (
            <FormField control={form.control} name="material_request" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Material Request (→ Material Request)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Material Request..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Manufacture against Material Request</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="production_plan" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Production Plan (→ Production Plan)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Production Plan..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="production_plan_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Production Plan Item</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="production_plan_sub_assembly_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Production Plan Sub-assembly Item</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="product_bundle_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Product Bundle Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Work Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Work Order..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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