"use client";

// Form for Process Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessPeriodClosingVoucher } from "../types/process-period-closing-voucher.js";
import { ProcessPeriodClosingVoucherInsertSchema } from "../types/process-period-closing-voucher.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ProcessPeriodClosingVoucherFormProps {
  initialData?: Partial<ProcessPeriodClosingVoucher>;
  onSubmit: (data: Partial<ProcessPeriodClosingVoucher>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessPeriodClosingVoucherForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessPeriodClosingVoucherFormProps) {
  const form = useForm<Partial<ProcessPeriodClosingVoucher>>({
    resolver: zodResolver(ProcessPeriodClosingVoucherInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Period Closing Voucher" : "New Process Period Closing Voucher"}
        </h2>
            <FormField control={form.control} name="parent_pcv" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">PCV (→ Period Closing Voucher)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Period Closing Voucher..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
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
            <FormField control={form.control} name="p_l_closing_balance" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">P&L Closing Balance</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Dates to Process</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Process Period Closing Voucher Detail — integrate with DataTable */}
                <p>Child table for Process Period Closing Voucher Detail</p>
              </div>
            </div>
            <FormField control={form.control} name="bs_closing_balance" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Balance Sheet Closing Balance</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Opening Balances</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Process Period Closing Voucher Detail — integrate with DataTable */}
                <p>Child table for Process Period Closing Voucher Detail</p>
              </div>
            </div>
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Process Period Closing Voucher)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Process Period Closing Voucher..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

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