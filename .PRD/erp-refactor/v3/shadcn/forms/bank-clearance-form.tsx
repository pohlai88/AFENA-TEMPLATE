"use client";

// Form for Bank Clearance
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankClearance } from "../types/bank-clearance.js";
import { BankClearanceInsertSchema } from "../types/bank-clearance.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankClearanceFormProps {
  initialData?: Partial<BankClearance>;
  onSubmit: (data: Partial<BankClearance>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankClearanceForm({ initialData = {}, onSubmit, mode, isLoading }: BankClearanceFormProps) {
  const form = useForm<Partial<BankClearance>>({
    resolver: zodResolver(BankClearanceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Clearance" : "New Bank Clearance"}
        </h2>
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bank_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Bank Account (→ Bank Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bank Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Select the Bank Account to reconcile.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="include_reconciled_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include Reconciled Entries</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="include_pos_transactions" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include POS Transactions</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Payment Entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Bank Clearance Detail — integrate with DataTable */}
                <p>Child table for Bank Clearance Detail</p>
              </div>
            </div>
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