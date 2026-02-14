"use client";

// Form for Asset
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Asset } from "../types/asset.js";
import { AssetInsertSchema } from "../types/asset.js";

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

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: Partial<Asset>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetForm({ initialData = {}, onSubmit, mode, isLoading }: AssetFormProps) {
  const form = useForm<Partial<Asset>>({
    resolver: zodResolver(AssetInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.asset_name as string) ?? "Asset" : "New Asset"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
        <Tabs defaultValue="depreciation" className="w-full">
          <TabsList>
            <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
            <TabsTrigger value="more-info">More Info</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="depreciation" className="space-y-4">
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
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().item_code && (
            <FormField control={form.control} name="asset_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="location" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Location (→ Location)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Location..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().item_code && (
            <FormField control={form.control} name="asset_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Category (→ Asset Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Category..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="asset_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Existing Asset">Existing Asset</SelectItem>
                    <SelectItem value="Composite Asset">Composite Asset</SelectItem>
                    <SelectItem value="Composite Component">Composite Component</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maintenance_required" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Maintenance Required</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="calculate_depreciation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Calculate Depreciation</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().asset_type !== "Composite Asset" && form.getValues().asset_type !== "Existing Asset" && (
            <FormField control={form.control} name="purchase_receipt" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Receipt (→ Purchase Receipt)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Receipt..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().asset_type !== "Composite Asset" && form.getValues().asset_type !== "Existing Asset" && (
            <FormField control={form.control} name="purchase_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Invoice (→ Purchase Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Purchase Invoice..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="purchase_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="available_for_use_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Available for Use Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disposal_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Disposal Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="net_purchase_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Purchase Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="asset_quantity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus > 0 && (
            <FormField control={form.control} name="additional_asset_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Additional Asset Cost</FormLabel>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().docstatus > 0 && (
            <FormField control={form.control} name="total_asset_cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Asset Cost</FormLabel>
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
            {(form.getValues().asset_type === "Existing Asset") && (
            <FormField control={form.control} name="opening_accumulated_depreciation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opening Accumulated Depreciation</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().asset_type === "Existing Asset") && (
            <FormField control={form.control} name="opening_number_of_booked_depreciations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opening Number of Booked Depreciations</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Finance Books</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Asset Finance Book — integrate with DataTable */}
                <p>Child table for Asset Finance Book</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Depreciation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="depreciation_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Method</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Straight Line">Straight Line</SelectItem>
                    <SelectItem value="Double Declining Balance">Double Declining Balance</SelectItem>
                    <SelectItem value="Written Down Value">Written Down Value</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="frequency_of_depreciation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Frequency of Depreciation (Months)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_number_of_depreciations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Number of Depreciations</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Depreciation Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="more-info" className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="asset_owner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Owner</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().asset_owner === "Company" && (
            <FormField control={form.control} name="asset_owner_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Owner Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().asset_owner === "Customer" && (
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
            {form.getValues().asset_owner === "Supplier" && (
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Insurance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="policy_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Policy number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="insurer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Insurer</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="insured_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Insured value</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="insurance_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Insurance Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="insurance_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Insurance End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="comprehensive_insurance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Comprehensive Insurance</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Info</CardTitle>
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
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Partially Depreciated">Partially Depreciated</SelectItem>
                    <SelectItem value="Fully Depreciated">Fully Depreciated</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Scrapped">Scrapped</SelectItem>
                    <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                    <SelectItem value="Out of Order">Out of Order</SelectItem>
                    <SelectItem value="Issue">Issue</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="Capitalized">Capitalized</SelectItem>
                    <SelectItem value="Work In Progress">Work In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="custodian" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Custodian (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="department" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Department (→ Department)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Department..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="journal_entry_for_scrap" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Journal Entry for Scrap (→ Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="split_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Split From (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} disabled />
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