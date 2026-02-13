"use client";

// Form for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessPeriodClosingVoucherDetail } from "../types/process-period-closing-voucher-detail.js";
import { ProcessPeriodClosingVoucherDetailInsertSchema } from "../types/process-period-closing-voucher-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ProcessPeriodClosingVoucherDetailFormProps {
  initialData?: Partial<ProcessPeriodClosingVoucherDetail>;
  onSubmit: (data: Partial<ProcessPeriodClosingVoucherDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessPeriodClosingVoucherDetailForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessPeriodClosingVoucherDetailFormProps) {
  const form = useForm<Partial<ProcessPeriodClosingVoucherDetail>>({
    resolver: zodResolver(ProcessPeriodClosingVoucherDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Period Closing Voucher Detail" : "New Process Period Closing Voucher Detail"}
        </h2>
            <FormField control={form.control} name="processing_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Processing Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="report_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Report Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Profit and Loss">Profit and Loss</SelectItem>
                    <SelectItem value="Balance Sheet">Balance Sheet</SelectItem>
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
                    <SelectItem value="Queued">Queued</SelectItem>
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="closing_balance" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Closing Balance</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
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