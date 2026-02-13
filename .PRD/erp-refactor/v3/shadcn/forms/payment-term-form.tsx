"use client";

// Form for Payment Term
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentTerm } from "../types/payment-term.js";
import { PaymentTermInsertSchema } from "../types/payment-term.js";

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

interface PaymentTermFormProps {
  initialData?: Partial<PaymentTerm>;
  onSubmit: (data: Partial<PaymentTerm>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PaymentTermForm({ initialData = {}, onSubmit, mode, isLoading }: PaymentTermFormProps) {
  const form = useForm<Partial<PaymentTerm>>({
    resolver: zodResolver(PaymentTermInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Payment Term" : "New Payment Term"}
        </h2>
            <FormField control={form.control} name="payment_term_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Payment Term Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice_portion" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Invoice Portion (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment (→ Mode of Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Mode of Payment..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="due_date_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Due Date Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Day(s) after invoice date">Day(s) after invoice date</SelectItem>
                    <SelectItem value="Day(s) after the end of the invoice month">Day(s) after the end of the invoice month</SelectItem>
                    <SelectItem value="Month(s) after the end of the invoice month">Month(s) after the end of the invoice month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {in_list(['Day(s) after invoice date', 'Day(s) after the end of the invoice month'], form.getValues().due_date_based_on) && (
            <FormField control={form.control} name="credit_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Credit Days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().due_date_based_on==='Month(s) after the end of the invoice month' && (
            <FormField control={form.control} name="credit_months" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Credit Months</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discount Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="discount_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().discount && (
            <FormField control={form.control} name="discount_validity_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Validity Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Day(s) after invoice date">Day(s) after invoice date</SelectItem>
                    <SelectItem value="Day(s) after the end of the invoice month">Day(s) after the end of the invoice month</SelectItem>
                    <SelectItem value="Month(s) after the end of the invoice month">Month(s) after the end of the invoice month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().discount && (
            <FormField control={form.control} name="discount_validity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Validity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
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
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-semibold">Description</FormLabel>
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