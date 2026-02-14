"use client";

// Form for Journal Entry
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JournalEntry } from "../types/journal-entry.js";
import { JournalEntryInsertSchema } from "../types/journal-entry.js";

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

interface JournalEntryFormProps {
  initialData?: Partial<JournalEntry>;
  onSubmit: (data: Partial<JournalEntry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function JournalEntryForm({ initialData = {}, onSubmit, mode, isLoading }: JournalEntryFormProps) {
  const form = useForm<Partial<JournalEntry>>({
    resolver: zodResolver(JournalEntryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Journal Entry" : "New Journal Entry"}
          </h2>
          {mode === "edit" && (
            <Badge variant={(initialData as any)?.docstatus === 1 ? "default" : "secondary"}>
              {(initialData as any)?.docstatus === 0 ? "Draft" : (initialData as any)?.docstatus === 1 ? "Submitted" : "Cancelled"}
            </Badge>
          )}
        </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().is_system_generated === 1; && (
            <FormField control={form.control} name="is_system_generated" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is System Generated</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Entry Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Journal Entry">Journal Entry</SelectItem>
                    <SelectItem value="Inter Company Journal Entry">Inter Company Journal Entry</SelectItem>
                    <SelectItem value="Bank Entry">Bank Entry</SelectItem>
                    <SelectItem value="Cash Entry">Cash Entry</SelectItem>
                    <SelectItem value="Credit Card Entry">Credit Card Entry</SelectItem>
                    <SelectItem value="Debit Note">Debit Note</SelectItem>
                    <SelectItem value="Credit Note">Credit Note</SelectItem>
                    <SelectItem value="Contra Entry">Contra Entry</SelectItem>
                    <SelectItem value="Excise Entry">Excise Entry</SelectItem>
                    <SelectItem value="Write Off Entry">Write Off Entry</SelectItem>
                    <SelectItem value="Opening Entry">Opening Entry</SelectItem>
                    <SelectItem value="Depreciation Entry">Depreciation Entry</SelectItem>
                    <SelectItem value="Asset Disposal">Asset Disposal</SelectItem>
                    <SelectItem value="Periodic Accounting Entry">Periodic Accounting Entry</SelectItem>
                    <SelectItem value="Exchange Rate Revaluation">Exchange Rate Revaluation</SelectItem>
                    <SelectItem value="Exchange Gain Or Loss">Exchange Gain Or Loss</SelectItem>
                    <SelectItem value="Deferred Revenue">Deferred Revenue</SelectItem>
                    <SelectItem value="Deferred Expense">Deferred Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="process_deferred_accounting" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Process Deferred Accounting (→ Process Deferred Accounting)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Process Deferred Accounting..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().docstatus && (
            <FormField control={form.control} name="reversal_of" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reversal Of (→ Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="from_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Template (→ Journal Entry Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="finance_book" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finance Book (→ Finance Book)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Finance Book..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {['Credit Note', 'Debit Note'].includes(form.getValues().voucher_type) && (
            <FormField control={form.control} name="apply_tds" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Consider for Tax Withholding </FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!!form.getValues().apply_tds && (
            <FormField control={form.control} name="tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Periodic Accounting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="for_all_stock_asset_accounts" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">For All Stock Asset Accounts</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().for_all_stock_asset_accounts ==== 0 && (
            <FormField control={form.control} name="stock_asset_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Asset Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().voucher_type ==== "Periodic Accounting Entry" && (
            <FormField control={form.control} name="periodic_entry_difference_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Periodic Entry Difference Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
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
            <div className="col-span-2">
              <FormLabel className="">Accounting Entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Journal Entry Account — integrate with DataTable */}
                <p>Child table for Journal Entry Account</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="cheque_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cheque_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="user_remark" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">User Remark</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_debit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Debit</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_credit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Credit</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().difference && (
            <FormField control={form.control} name="difference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Difference (Dr - Cr)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="multi_currency" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Multi Currency</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Withholding Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="tax_withholding_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Group (→ Tax Withholding Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_tax_withholding_threshold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Tax Withholding Threshold</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="override_tax_withholding_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Edit Tax Withholding Entries</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Tax Withholding Entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Tax Withholding Entry — integrate with DataTable */}
                <p>Child table for Tax Withholding Entry</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="clearance_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Clearance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="remark" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remark</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().voucher_type=== "Inter Company Journal Entry" && (
            <FormField control={form.control} name="inter_company_journal_entry_reference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Inter Company Journal Entry Reference (→ Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="bill_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Bill No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bill_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Bill Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="due_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Write Off</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().voucher_type === 'Write Off Entry' && (
            <FormField control={form.control} name="write_off_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Accounts Receivable">Accounts Receivable</SelectItem>
                    <SelectItem value="Accounts Payable">Accounts Payable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().voucher_type === 'Write Off Entry' && (
            <FormField control={form.control} name="write_off_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
          <CardTitle className="text-base">Printing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="pay_to_recd_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pay To / Recd From</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="letter_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Letter Head (→ Letter Head)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Letter Head..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="select_print_heading" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Heading (→ Print Heading)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Print Heading..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">More Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment (→ Mode of Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Mode of Payment..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Order (→ Payment Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Order..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_opening" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Is Opening</FormLabel>
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
                <FormMessage />
              </FormItem>
            )} />
            {in_list(["Credit Note", "Debit Note"], form.getValues().voucher_type) && (
            <FormField control={form.control} name="stock_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Entry (→ Stock Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Stock Entry..." {...f} value={(f.value as string) ?? ""} disabled />
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
          <CardTitle className="text-base">Subscription Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_repeat" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Auto Repeat (→ Auto Repeat)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Auto Repeat..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Journal Entry..." {...f} value={(f.value as string) ?? ""} disabled />
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