"use client";

// Form for Warranty Claim
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WarrantyClaim } from "../types/warranty-claim.js";
import { WarrantyClaimInsertSchema } from "../types/warranty-claim.js";

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

interface WarrantyClaimFormProps {
  initialData?: Partial<WarrantyClaim>;
  onSubmit: (data: Partial<WarrantyClaim>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WarrantyClaimForm({ initialData = {}, onSubmit, mode, isLoading }: WarrantyClaimFormProps) {
  const form = useForm<Partial<WarrantyClaim>>({
    resolver: zodResolver(WarrantyClaimInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.customer_name as string) ?? "Warranty Claim" : "New Warranty Claim"}
          </h2>
        </div>
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
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Work In Progress">Work In Progress</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="complaint_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="serial_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Serial No (→ Serial No)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Serial No..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="complaint" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Issue</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Item and Warranty Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            {!!form.getValues().item_code && (
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="warranty_amc_status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warranty / AMC Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Under Warranty">Under Warranty</SelectItem>
                    <SelectItem value="Out of Warranty">Out of Warranty</SelectItem>
                    <SelectItem value="Under AMC">Under AMC</SelectItem>
                    <SelectItem value="Out of AMC">Out of AMC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="warranty_expiry_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warranty Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amc_expiry_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">AMC Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resolution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="resolution_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Resolution Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="resolved_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Resolved By (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="resolution_details" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Resolution Details</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().customer && (
            <FormField control={form.control} name="customer_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Customer Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="contact_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Person (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().customer && (
            <FormField control={form.control} name="contact_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().customer && (
            <FormField control={form.control} name="contact_mobile" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mobile No</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().customer && (
            <FormField control={form.control} name="contact_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().customer && (
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().customer && (
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="customer_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().customer && (
            <FormField control={form.control} name="address_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().customer && (
            <FormField control={form.control} name="service_address" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Service Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>If different than customer address</FormDescription>
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
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="complaint_raised_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Raised By</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Company</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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