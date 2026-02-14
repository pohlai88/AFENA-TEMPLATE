"use client";

// Form for Stock Entry
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockEntry } from "../types/stock-entry.js";
import { StockEntryInsertSchema } from "../types/stock-entry.js";

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

interface StockEntryFormProps {
  initialData?: Partial<StockEntry>;
  onSubmit: (data: Partial<StockEntry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function StockEntryForm({ initialData = {}, onSubmit, mode, isLoading }: StockEntryFormProps) {
  const form = useForm<Partial<StockEntry>>({
    resolver: zodResolver(StockEntryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.stock_entry_type as string) ?? "Stock Entry" : "New Stock Entry"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="additional-costs">Additional Costs</TabsTrigger>
            <TabsTrigger value="supplier-info">Supplier Info</TabsTrigger>
            <TabsTrigger value="accounting-dimensions">Accounting Dimensions</TabsTrigger>
            <TabsTrigger value="other-info">Other Info</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
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
            <FormField control={form.control} name="stock_entry_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Entry Type (→ Stock Entry Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Stock Entry Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().purpose === 'Material Transfer' && (
            <FormField control={form.control} name="outgoing_stock_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Entry (Outward GIT) (→ Stock Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Stock Entry..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().purpose==='Material Transfer' && !form.getValues().outgoing_stock_entry && (
            <FormField control={form.control} name="add_to_transit" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Add to Transit</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {in_list(["Material Transfer for Manufacture", "Manufacture", "Material Consumption for Manufacture", "Disassemble"], form.getValues().purpose) && (
            <FormField control={form.control} name="work_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Work Order (→ Work Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Work Order..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="job_card" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Card (→ Job Card)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Job Card..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
            <FormField control={form.control} name="purchase_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Order (→ Purchase Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Order..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
            <FormField control={form.control} name="subcontracting_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subcontracting Order (→ Subcontracting Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subcontracting Order..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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
            {form.getValues().purpose==="Sales Return" && (
            <FormField control={form.control} name="delivery_note_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delivery Note No (→ Delivery Note)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Delivery Note..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().purpose==="Sales Return" && (
            <FormField control={form.control} name="sales_invoice_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Invoice No (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="pick_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pick List (→ Pick List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Pick List..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().purpose==="Purchase Return" && (
            <FormField control={form.control} name="purchase_receipt_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Receipt No (→ Purchase Receipt)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Receipt..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().asset_repair && (
            <FormField control={form.control} name="asset_repair" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Repair (→ Asset Repair)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Repair..." {...f} value={(f.value as string) ?? ""} disabled />
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
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus===0 && (
            <FormField control={form.control} name="set_posting_time" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Edit Posting Date and Time</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="inspection_required" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Inspection Required</FormLabel>
                </div>
              </FormItem>
            )} />
            {in_list(["Material Transfer", "Material Receipt"], form.getValues().purpose) && (
            <FormField control={form.control} name="apply_putaway_rule" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply Putaway Rule</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().purpose === "Material Transfer for Manufacture" && (
            <FormField control={form.control} name="is_additional_transfer_entry" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Additional Transfer Entry</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">BOM Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {in_list(["Material Issue", "Material Transfer", "Manufacture", "Repack", "Send to Subcontractor", "Material Transfer for Manufacture", "Material Consumption for Manufacture", "Disassemble"], form.getValues().purpose) && (
            <FormField control={form.control} name="from_bom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">From BOM</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().from_bom && (
            <FormField control={form.control} name="use_multi_level_bom" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Multi-Level BOM</FormLabel>
                  <FormDescription>Including items for sub assemblies</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().from_bom && (
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
            {!!form.getValues().from_bom && (
            <FormField control={form.control} name="fg_completed_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finished Good Quantity </FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>As per Stock UOM</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Process Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().from_bom && form.getValues().fg_completed_qty && (
            <FormField control={form.control} name="process_loss_percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">% Process Loss</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().fg_completed_qty > 0 && in_list(["Manufacture", "Repack"], form.getValues().purpose) && (
            <FormField control={form.control} name="process_loss_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Process Loss Qty</FormLabel>
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
          <CardTitle className="text-base">Default Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="from_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Source Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Sets 'Source Warehouse' in each row of the items table.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().from_warehouse && (
            <FormField control={form.control} name="source_warehouse_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source Warehouse Address Link (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="source_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Source Warehouse Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Target Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Sets 'Target Warehouse' in each row of the items table.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().to_warehouse && (
            <FormField control={form.control} name="target_warehouse_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Warehouse Address Link (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="target_address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Target Warehouse Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
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
            <FormField control={form.control} name="scan_barcode" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Scan Barcode</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().last_scanned_warehouse && (
            <FormField control={form.control} name="last_scanned_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Last Scanned Warehouse</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Stock Entry Detail — integrate with DataTable */}
                <p>Child table for Stock Entry Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="total_outgoing_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Outgoing Value (Consumption)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_incoming_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Incoming Value (Receipt)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="value_difference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Value Difference (Incoming - Outgoing)</FormLabel>
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
          <TabsContent value="additional-costs" className="space-y-4">
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
          <TabsContent value="supplier-info" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
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
            {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
            <FormField control={form.control} name="supplier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Supplier Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
            <FormField control={form.control} name="supplier_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address</FormLabel>
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
          <TabsContent value="accounting-dimensions" className="space-y-4">
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="other-info" className="space-y-4">
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">More Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="is_opening" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Opening</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="per_transferred" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Per Transferred</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().total_amount && (
            <FormField control={form.control} name="total_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Stock Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Stock Entry..." {...f} value={(f.value as string) ?? ""} disabled />
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