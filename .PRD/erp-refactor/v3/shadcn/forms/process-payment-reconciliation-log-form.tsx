"use client";

// Form for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessPaymentReconciliationLog } from "../types/process-payment-reconciliation-log.js";
import { ProcessPaymentReconciliationLogInsertSchema } from "../types/process-payment-reconciliation-log.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcessPaymentReconciliationLogFormProps {
  initialData?: Partial<ProcessPaymentReconciliationLog>;
  onSubmit: (data: Partial<ProcessPaymentReconciliationLog>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessPaymentReconciliationLogForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessPaymentReconciliationLogFormProps) {
  const form = useForm<Partial<ProcessPaymentReconciliationLog>>({
    resolver: zodResolver(ProcessPaymentReconciliationLogInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Payment Reconciliation Log" : "New Process Payment Reconciliation Log"}
        </h2>
            <FormField control={form.control} name="process_pr" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parent Document (→ Process Payment Reconciliation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Process Payment Reconciliation..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Reconciled">Reconciled</SelectItem>
                    <SelectItem value="Partially Reconciled">Partially Reconciled</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allocated" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allocated</FormLabel>
                  <FormDescription>Invoices and Payments have been Fetched and Allocated</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="reconciled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Reconciled</FormLabel>
                  <FormDescription>All allocations have been successfully reconciled</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="total_allocations" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Allocations</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reconciled_entries" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reconciled Entries</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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
            {!!form.getValues().error_log && (
            <FormField control={form.control} name="error_log" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Reconciliation Error Log</FormLabel>
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
          <CardTitle className="text-base">Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Allocations</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Process Payment Reconciliation Log Allocations — integrate with DataTable */}
                <p>Child table for Process Payment Reconciliation Log Allocations</p>
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