"use client";

// Form for Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Account } from "../types/account.js";
import { AccountInsertSchema } from "../types/account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: Partial<Account>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountForm({ initialData = {}, onSubmit, mode, isLoading }: AccountFormProps) {
  const form = useForm<Partial<Account>>({
    resolver: zodResolver(AccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Account" : "New Account"}
        </h2>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="account_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_group" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Group</FormLabel>
                </div>
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
            <FormField control={form.control} name="root_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Root Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="report_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Report Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Balance Sheet">Balance Sheet</SelectItem>
                    <SelectItem value="Profit and Loss">Profit and Loss</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().is_group===0 && (
            <FormField control={form.control} name="account_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="parent_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parent Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Category (→ Account Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Used with Financial Report Template</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Accumulated Depreciation">Accumulated Depreciation</SelectItem>
                    <SelectItem value="Asset Received But Not Billed">Asset Received But Not Billed</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Chargeable">Chargeable</SelectItem>
                    <SelectItem value="Capital Work in Progress">Capital Work in Progress</SelectItem>
                    <SelectItem value="Cost of Goods Sold">Cost of Goods Sold</SelectItem>
                    <SelectItem value="Current Asset">Current Asset</SelectItem>
                    <SelectItem value="Current Liability">Current Liability</SelectItem>
                    <SelectItem value="Depreciation">Depreciation</SelectItem>
                    <SelectItem value="Direct Expense">Direct Expense</SelectItem>
                    <SelectItem value="Direct Income">Direct Income</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Expense Account">Expense Account</SelectItem>
                    <SelectItem value="Expenses Included In Asset Valuation">Expenses Included In Asset Valuation</SelectItem>
                    <SelectItem value="Expenses Included In Valuation">Expenses Included In Valuation</SelectItem>
                    <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                    <SelectItem value="Income Account">Income Account</SelectItem>
                    <SelectItem value="Indirect Expense">Indirect Expense</SelectItem>
                    <SelectItem value="Indirect Income">Indirect Income</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Payable">Payable</SelectItem>
                    <SelectItem value="Receivable">Receivable</SelectItem>
                    <SelectItem value="Round Off">Round Off</SelectItem>
                    <SelectItem value="Round Off for Opening">Round Off for Opening</SelectItem>
                    <SelectItem value="Stock">Stock</SelectItem>
                    <SelectItem value="Stock Adjustment">Stock Adjustment</SelectItem>
                    <SelectItem value="Stock Received But Not Billed">Stock Received But Not Billed</SelectItem>
                    <SelectItem value="Service Received But Not Billed">Service Received But Not Billed</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Setting Account Type helps in selecting this Account in transactions.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Rate at which this tax is applied</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="freeze_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Frozen</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>If the account is frozen, entries are allowed to restricted users.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="balance_must_be" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Balance must be</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {(form.getValues().report_type === 'Profit && Loss' && !form.getValues().is_group) && (
            <FormField control={form.control} name="include_in_gross" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include in gross</FormLabel>
                </div>
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