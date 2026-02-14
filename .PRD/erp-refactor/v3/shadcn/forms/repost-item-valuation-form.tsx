"use client";

// Form for Repost Item Valuation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RepostItemValuation } from "../types/repost-item-valuation.js";
import { RepostItemValuationInsertSchema } from "../types/repost-item-valuation.js";

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

interface RepostItemValuationFormProps {
  initialData?: Partial<RepostItemValuation>;
  onSubmit: (data: Partial<RepostItemValuation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RepostItemValuationForm({ initialData = {}, onSubmit, mode, isLoading }: RepostItemValuationFormProps) {
  const form = useForm<Partial<RepostItemValuation>>({
    resolver: zodResolver(RepostItemValuationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Repost Item Valuation" : "New Repost Item Valuation"}
        </h2>
            <FormField control={form.control} name="based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                    <SelectItem value="Item and Warehouse">Item and Warehouse</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().based_on==='Transaction' && (
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().based_on==='Transaction' && (
            <FormField control={form.control} name="voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().based_on==='Item && Warehouse' && (
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().based_on==='Item && Warehouse' && (
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
                    <SelectItem value="Queued">Queued</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Skipped">Skipped</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
            {!!form.getValues().repost_only_accounting_ledgers && (
            <FormField control={form.control} name="reposting_reference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reposting Reference</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().based_on ==== "Transaction" && (
            <FormField control={form.control} name="repost_only_accounting_ledgers" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Repost Only Accounting Ledgers</FormLabel>
                  <FormDescription>Stock Ledgers won’t be reposted.</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="allow_negative_stock" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Negative Stock</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="via_landed_cost_voucher" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Via Landed Cost Voucher</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_zero_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Zero Rate</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().based_on === "Transaction" && (
            <FormField control={form.control} name="recreate_stock_ledgers" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Recreate Stock Ledgers</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Repost Item Valuation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Repost Item Valuation..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="error_log" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Error Log</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reposting Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="reposting_data_file" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reposting Data File</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_reposting_count" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Reposting Count</FormLabel>
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