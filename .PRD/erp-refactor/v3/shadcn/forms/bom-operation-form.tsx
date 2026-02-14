"use client";

// Form for BOM Operation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BomOperation } from "../types/bom-operation.js";
import { BomOperationInsertSchema } from "../types/bom-operation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BomOperationFormProps {
  initialData?: Partial<BomOperation>;
  onSubmit: (data: Partial<BomOperation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BomOperationForm({ initialData = {}, onSubmit, mode, isLoading }: BomOperationFormProps) {
  const form = useForm<Partial<BomOperation>>({
    resolver: zodResolver(BomOperationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "BOM Operation" : "New BOM Operation"}
        </h2>
            <FormField control={form.control} name="operation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation (→ Operation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Operation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().parenttype === "Routing" && (
            <FormField control={form.control} name="sequence_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sequence ID</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>If you want to run operations in parallel, keep the same sequence ID for them.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {parent.track_semi_finished_goods ==== 1 && (
            <FormField control={form.control} name="finished_good" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">FG / Semi FG Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {parent.track_semi_finished_goods ==== 1 && (
            <FormField control={form.control} name="finished_good_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qty to Produce</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {parent.track_semi_finished_goods ==== 1 && (
            <FormField control={form.control} name="bom_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">BOM No (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="workstation_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Workstation Type (→ Workstation Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().workstation_type && (
            <FormField control={form.control} name="workstation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Workstation (→ Workstation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="time_in_mins" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>In minutes</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fixed_time" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Fixed Time</FormLabel>
                  <FormDescription>Operation time does not depend on quantity to produce</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_subcontracted" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Subcontracted</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_final_finished_good" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Final Finished Good</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="set_cost_based_on_bom_qty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Set Operating Cost Based On BOM Quantity</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="skip_material_transfer" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className=""> Skip Material Transfer</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().skip_material_transfer && (
            <FormField control={form.control} name="backflush_from_wip_warehouse" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Backflush Materials From WIP Warehouse</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().skip_material_transfer && !form.getValues().backflush_from_wip_warehouse && (
            <FormField control={form.control} name="source_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().skip_material_transfer || form.getValues().backflush_from_wip_warehouse && (
            <FormField control={form.control} name="wip_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">WIP Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="fg_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finished Goods Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="hour_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Hour Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.doctype === 'BOM' && (
            <FormField control={form.control} name="base_hour_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Base Hour Rate(Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="batch_size" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Batch Size</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().batch_size > 0 && form.getValues().set_cost_based_on_bom_qty && (
            <FormField control={form.control} name="cost_per_unit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Per Unit</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operating Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {parent.doctype === 'BOM' && (
            <FormField control={form.control} name="base_operating_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operating Cost(Company Currency)</FormLabel>
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
          <CardTitle className="text-base">More Information</CardTitle>
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
            <FormField control={form.control} name="image" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Image</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
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