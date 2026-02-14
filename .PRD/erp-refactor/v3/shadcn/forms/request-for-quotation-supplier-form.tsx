"use client";

// Form for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RequestForQuotationSupplier } from "../types/request-for-quotation-supplier.js";
import { RequestForQuotationSupplierInsertSchema } from "../types/request-for-quotation-supplier.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RequestForQuotationSupplierFormProps {
  initialData?: Partial<RequestForQuotationSupplier>;
  onSubmit: (data: Partial<RequestForQuotationSupplier>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RequestForQuotationSupplierForm({ initialData = {}, onSubmit, mode, isLoading }: RequestForQuotationSupplierFormProps) {
  const form = useForm<Partial<RequestForQuotationSupplier>>({
    resolver: zodResolver(RequestForQuotationSupplierInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Request for Quotation Supplier" : "New Request for Quotation Supplier"}
        </h2>
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus >= 1 && (
            <FormField control={form.control} name="quote_status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quote Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="supplier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Supplier Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="send_email" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Send Email</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().docstatus >= 1 && (
            <FormField control={form.control} name="email_sent" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Email Sent</FormLabel>
                </div>
              </FormItem>
            )} />
            )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}