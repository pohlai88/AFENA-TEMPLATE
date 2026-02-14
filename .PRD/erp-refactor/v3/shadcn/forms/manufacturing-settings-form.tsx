"use client";

// Form for Manufacturing Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ManufacturingSettings } from "../types/manufacturing-settings.js";
import { ManufacturingSettingsInsertSchema } from "../types/manufacturing-settings.js";

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

interface ManufacturingSettingsFormProps {
  initialData?: Partial<ManufacturingSettings>;
  onSubmit: (data: Partial<ManufacturingSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ManufacturingSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: ManufacturingSettingsFormProps) {
  const form = useForm<Partial<ManufacturingSettings>>({
    resolver: zodResolver(ManufacturingSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Manufacturing Settings" : "New Manufacturing Settings"}
        </h2>
        <Tabs defaultValue="bom-and-production" className="w-full">
          <TabsList>
            <TabsTrigger value="bom-and-production">BOM and Production</TabsTrigger>
            <TabsTrigger value="job-card-and-capacity-planning">Job Card and Capacity Planning</TabsTrigger>
          </TabsList>
          <TabsContent value="bom-and-production" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw Materials Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="material_consumption" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Continuous Material Consumption</FormLabel>
                  <FormDescription>Allow material consumptions without immediately manufacturing finished goods against a Work Order</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().material_consumption && (
            <FormField control={form.control} name="get_rm_cost_from_consumption_entry" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Get Raw Materials Cost from Consumption Entry</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="backflush_raw_materials_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Backflush Raw Materials Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BOM">BOM</SelectItem>
                    <SelectItem value="Material Transferred for Manufacture">Material Transferred for Manufacture</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().backflush_raw_materials_based_on === "BOM" && (
            <FormField control={form.control} name="validate_components_quantities_per_bom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Validate Components and Quantities Per BOM</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">BOM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="update_bom_costs_automatically" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update BOM Cost Automatically</FormLabel>
                  <FormDescription>Update BOM cost automatically via scheduler, based on the latest Valuation Rate/Price List Rate/Last Purchase Rate of raw materials</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_editing_of_items_and_quantities_in_work_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Editing of Items and Quantities in Work Order</FormLabel>
                  <FormDescription>If enabled, the system will allow users to edit the raw materials and their quantities in the Work Order. The system will not reset the quantities as per the BOM, if the user has changed them.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overproduction for Sales and Work Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="overproduction_percentage_for_sales_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Overproduction Percentage For Sales Order</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="overproduction_percentage_for_work_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Overproduction Percentage For Work Order</FormLabel>
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
          <CardTitle className="text-base">Extra Material Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="transfer_extra_materials_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transfer Extra Raw Materials to WIP (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>The user will be able to transfer additional materials from the store to the Work in Progress (WIP) warehouse.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="job-card-and-capacity-planning" className="space-y-4">
            <FormField control={form.control} name="add_corrective_operation_cost_in_finished_good_valuation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Add Corrective Operation Cost in Finished Good Valuation</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enforce_time_logs" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enforce Time Logs</FormLabel>
                  <FormDescription>Enabling this checkbox will force each Job Card Time Log to have From Time and To Time</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="job_card_excess_transfer" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Excess Material Transfer</FormLabel>
                  <FormDescription>Allow transferring raw materials even after the Required Quantity is fulfilled</FormDescription>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capacity Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="disable_capacity_planning" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Capacity Planning</FormLabel>
                </div>
              </FormItem>
            )} />
            {!form.getValues().disable_capacity_planning && (
            <FormField control={form.control} name="allow_overtime" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Overtime</FormLabel>
                  <FormDescription>Plan time logs outside Workstation working hours</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {!form.getValues().disable_capacity_planning && (
            <FormField control={form.control} name="allow_production_on_holidays" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Production on Holidays</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!form.getValues().disable_capacity_planning && (
            <FormField control={form.control} name="capacity_planning_for_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Capacity Planning For (Days)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Plan operations X days in advance</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().disable_capacity_planning && (
            <FormField control={form.control} name="mins_between_operations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Time Between Operations (Mins)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Default: 10 mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="set_op_cost_and_scrap_from_sub_assemblies" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Operating Cost / Scrap Items From Sub-assemblies</FormLabel>
                  <FormDescription>To include sub-assembly costs and scrap items in Finished Goods on a work order without using a job card, when the 'Use Multi-Level BOM' option is enabled.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="make_serial_no_batch_from_work_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Make Serial No / Batch from Work Order</FormLabel>
                  <FormDescription>System will automatically create the serial numbers / batch for the Finished Good on submission of work order</FormDescription>
                </div>
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