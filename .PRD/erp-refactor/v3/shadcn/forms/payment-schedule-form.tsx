"use client";

// Form for Payment Schedule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentSchedule } from "../types/payment-schedule.js";
import { PaymentScheduleInsertSchema } from "../types/payment-schedule.js";

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

interface PaymentScheduleFormProps {
  initialData?: Partial<PaymentSchedule>;
  onSubmit: (data: Partial<PaymentSchedule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PaymentScheduleForm({ initialData = {}, onSubmit, mode, isLoading }: PaymentScheduleFormProps) {
  const form = useForm<Partial<PaymentSchedule>>({
    resolver: zodResolver(PaymentScheduleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Payment Schedule" : "New Payment Schedule"}
        </h2>
            <FormField control={form.control} name="payment_term" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Term (→ Payment Term)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Term..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="due_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice_portion" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Portion</FormLabel>
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
                <FormLabel className="">Due Date Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
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
                <FormLabel className="">Credit Days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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
            {!!form.getValues().discount && (
            <FormField control={form.control} name="discount_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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
            {!!form.getValues().discount && (
            <FormField control={form.control} name="discount_validity_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Validity Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
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
            {!!form.getValues().discount_validity_based_on && (
            <FormField control={form.control} name="discount_validity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discount Validity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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
            <FormField control={form.control} name="payment_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="outstanding" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().paid_amount && (
            <FormField control={form.control} name="paid_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Paid Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().discounted_amount && (
            <FormField control={form.control} name="discounted_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discounted Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="base_payment_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_outstanding" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().base_paid_amount && (
            <FormField control={form.control} name="base_paid_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Paid Amount (Company Currency)</FormLabel>
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}