"use client";

// Form for Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PeriodClosingVoucher } from "../types/period-closing-voucher.js";
import { PeriodClosingVoucherInsertSchema } from "../types/period-closing-voucher.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface PeriodClosingVoucherFormProps {
  initialData?: Partial<PeriodClosingVoucher>;
  onSubmit: (data: Partial<PeriodClosingVoucher>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PeriodClosingVoucherForm({ initialData = {}, onSubmit, mode, isLoading }: PeriodClosingVoucherFormProps) {
  const form = useForm<Partial<PeriodClosingVoucher>>({
    resolver: zodResolver(PeriodClosingVoucherInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.closing_account_head as string) ?? "Period Closing Voucher" : "New Period Closing Voucher"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
            <FormField control={form.control} name="transaction_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transaction Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
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
            <FormField control={form.control} name="fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="period_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Period Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="period_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Period End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Period Closing Voucher)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Period Closing Voucher..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="closing_account_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Closing Account Head (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>The account head under Liability or Equity, in which Profit/Loss will be booked</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus!==0 && (
            <FormField control={form.control} name="gle_processing_status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">GL Entry Processing Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().gle_processing_status==='Failed' && (
            <FormField control={form.control} name="error_message" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Error Message</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}

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