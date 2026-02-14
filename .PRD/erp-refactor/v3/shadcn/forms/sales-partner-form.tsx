"use client";

// Form for Sales Partner
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesPartner } from "../types/sales-partner.js";
import { SalesPartnerInsertSchema } from "../types/sales-partner.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesPartnerFormProps {
  initialData?: Partial<SalesPartner>;
  onSubmit: (data: Partial<SalesPartner>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesPartnerForm({ initialData = {}, onSubmit, mode, isLoading }: SalesPartnerFormProps) {
  const form = useForm<Partial<SalesPartner>>({
    resolver: zodResolver(SalesPartnerInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Partner" : "New Sales Partner"}
        </h2>
            <FormField control={form.control} name="partner_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="partner_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Partner Type (→ Sales Partner Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Partner Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="commission_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Commission Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address & Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().__islocal && (
            <FormField control={form.control} name="address_desc" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address Desc</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="address_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().__islocal && (
            <FormField control={form.control} name="contact_desc" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact Desc</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="contact_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact HTML</FormLabel>
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
          <CardTitle className="text-base">Sales Partner Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Targets</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Target Detail — integrate with DataTable */}
                <p>Child table for Target Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Website</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="show_in_website" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show In Website</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="referral_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Referral Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>To Track inbound purchase</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="route" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Route</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="logo" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Logo</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="partner_website" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Partner website</FormLabel>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="introduction" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Introduction</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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