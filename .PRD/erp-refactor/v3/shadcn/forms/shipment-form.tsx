"use client";

// Form for Shipment
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Shipment } from "../types/shipment.js";
import { ShipmentInsertSchema } from "../types/shipment.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShipmentFormProps {
  initialData?: Partial<Shipment>;
  onSubmit: (data: Partial<Shipment>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ShipmentForm({ initialData = {}, onSubmit, mode, isLoading }: ShipmentFormProps) {
  const form = useForm<Partial<Shipment>>({
    resolver: zodResolver(ShipmentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Shipment" : "New Shipment"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pickup from</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="pickup_from_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup from</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().pickup_from_type === 'Company' && (
            <FormField control={form.control} name="pickup_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().pickup_from_type === 'Customer' && (
            <FormField control={form.control} name="pickup_customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().pickup_from_type === 'Supplier' && (
            <FormField control={form.control} name="pickup_supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().pickup_customer || form.getValues().pickup_supplier || form.getValues().pickup_from_type === "Company" && (
            <FormField control={form.control} name="pickup_address_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="pickup_address" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">pickup_address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().pickup_from_type ==== 'Company' && (
            <FormField control={form.control} name="pickup_contact_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup Contact Person (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().pickup_customer || form.getValues().pickup_supplier || form.getValues().pickup_from_type !==== "Company" && (
            <FormField control={form.control} name="pickup_contact_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="pickup_contact" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">pickup_contact</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Delivery to</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="delivery_to_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delivery to</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().delivery_to_type === 'Company' && (
            <FormField control={form.control} name="delivery_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().delivery_to_type === 'Customer' && (
            <FormField control={form.control} name="delivery_customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().delivery_to_type === 'Supplier' && (
            <FormField control={form.control} name="delivery_supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().delivery_customer || form.getValues().delivery_supplier || form.getValues().delivery_to_type === "Company" && (
            <FormField control={form.control} name="delivery_address_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="delivery_address" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">delivery_address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().delivery_customer || form.getValues().delivery_supplier || form.getValues().delivery_to_type === "Company" && (
            <FormField control={form.control} name="delivery_contact_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().delivery_contact_name && (
            <FormField control={form.control} name="delivery_contact" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">delivery_contact</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
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
          <CardTitle className="text-base">Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Shipment Parcel</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Shipment Parcel — integrate with DataTable */}
                <p>Child table for Shipment Parcel</p>
              </div>
            </div>
            <FormField control={form.control} name="parcel_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parcel Template (→ Shipment Parcel Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Shipment Parcel Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Shipment Delivery Note</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Shipment Delivery Note — integrate with DataTable */}
                <p>Child table for Shipment Delivery Note</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="pallets" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pallets</FormLabel>
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
            <FormField control={form.control} name="value_of_goods" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value of Goods</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pickup_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pickup_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup from</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pickup_to" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup to</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipment_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shipment Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Goods">Goods</SelectItem>
                    <SelectItem value="Documents">Documents</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pickup_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pickup Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Self delivery">Self delivery</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="incoterm" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Incoterm (→ Incoterm)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Incoterm..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description_of_content" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description of Content</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="service_provider" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Provider</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipment_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shipment ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipment_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shipment Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
                    <SelectItem value="Booked">Booked</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="carrier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Carrier</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="carrier_service" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Carrier Service</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="awb_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">AWB Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tracking_status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tracking Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tracking_status_info" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tracking Status Info</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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