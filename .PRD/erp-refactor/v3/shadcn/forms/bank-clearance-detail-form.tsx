"use client";

// Form for Bank Clearance Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankClearanceDetail } from "../types/bank-clearance-detail.js";
import { BankClearanceDetailInsertSchema } from "../types/bank-clearance-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BankClearanceDetailFormProps {
  initialData?: Partial<BankClearanceDetail>;
  onSubmit: (data: Partial<BankClearanceDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankClearanceDetailForm({ initialData = {}, onSubmit, mode, isLoading }: BankClearanceDetailFormProps) {
  const form = useForm<Partial<BankClearanceDetail>>({
    resolver: zodResolver(BankClearanceDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Clearance Detail" : "New Bank Clearance Detail"}
        </h2>
            <FormField control={form.control} name="payment_document" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Document (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Entry</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="against_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Against Account</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cheque_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cheque Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cheque_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cheque Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="clearance_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Clearance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}