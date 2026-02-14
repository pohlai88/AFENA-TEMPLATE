"use client";

// Form for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankReconciliationTool } from "../types/bank-reconciliation-tool.js";
import { BankReconciliationToolInsertSchema } from "../types/bank-reconciliation-tool.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankReconciliationToolFormProps {
  initialData?: Partial<BankReconciliationTool>;
  onSubmit: (data: Partial<BankReconciliationTool>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankReconciliationToolForm({ initialData = {}, onSubmit, mode, isLoading }: BankReconciliationToolFormProps) {
  const form = useForm<Partial<BankReconciliationTool>>({
    resolver: zodResolver(BankReconciliationToolInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Reconciliation Tool" : "New Bank Reconciliation Tool"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
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
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().bank_account && !form.getValues().filter_by_reference_date && (
            <FormField control={form.control} name="bank_statement_from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().bank_account && !form.getValues().filter_by_reference_date && (
            <FormField control={form.control} name="bank_statement_to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().filter_by_reference_date && (
            <FormField control={form.control} name="from_reference_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Reference Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().filter_by_reference_date && (
            <FormField control={form.control} name="to_reference_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Reference Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="filter_by_reference_date" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Filter by Reference Date</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().bank_statement_from_date && (
            <FormField control={form.control} name="account_opening_balance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Opening Balance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().bank_statement_to_date && (
            <FormField control={form.control} name="bank_statement_closing_balance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Closing Balance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reconcile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="reconciliation_tool_cards" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">reconciliation_tool_cards</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reconciliation_tool_dt" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">reconciliation_tool_dt</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_bank_transactions" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">no_bank_transactions</FormLabel>
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