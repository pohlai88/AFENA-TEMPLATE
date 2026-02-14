"use client";

// Form for Accounts Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountsSettings } from "../types/accounts-settings.js";
import { AccountsSettingsInsertSchema } from "../types/accounts-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountsSettingsFormProps {
  initialData?: Partial<AccountsSettings>;
  onSubmit: (data: Partial<AccountsSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountsSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: AccountsSettingsFormProps) {
  const form = useForm<Partial<AccountsSettings>>({
    resolver: zodResolver(AccountsSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Accounts Settings" : "New Accounts Settings"}
        </h2>
        <Tabs defaultValue="invoice-and-billing" className="w-full">
          <TabsList>
            <TabsTrigger value="invoice-and-billing">Invoice and Billing</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="credit-limits">Credit Limits</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="accounts-closing">Accounts Closing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>
          <TabsContent value="invoice-and-billing" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Cancellation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="unlink_payment_on_cancellation_of_invoice" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Unlink Payment on Cancellation of Invoice</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="unlink_advance_payment_on_cancelation_of_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Unlink Advance Payment on Cancellation of Order</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="delete_linked_ledger_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Delete Accounting and Stock Ledger Entries on deletion of Transaction</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_immutable_ledger" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Immutable Ledger</FormLabel>
                  <FormDescription>On enabling this cancellation entries will be posted on the actual cancellation date and reports will consider cancelled entries as well</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoicing Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="check_supplier_invoice_uniqueness" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Check Supplier Invoice Number Uniqueness</FormLabel>
                  <FormDescription>Enabling this ensures each Purchase Invoice has a unique value in Supplier Invoice No. field within a particular fiscal year</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="automatically_fetch_payment_terms" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically Fetch Payment Terms from Order</FormLabel>
                  <FormDescription>Payment Terms from orders will be fetched into the invoices as is</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_common_party_accounting" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Common Party Accounting</FormLabel>
                  <FormDescription>Learn about &lt;a href=&quot;https://docs.frappe.io/erpnext/user/manual/en/common_party_accounting&quot; rel=&quot;noopener noreferrer&quot;&gt;Common Party&lt;/a&gt;</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_multi_currency_invoices_against_single_party_account" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow multi-currency invoices against single party account </FormLabel>
                  <FormDescription>Enabling this will allow creation of multi-currency invoices against single party account in company currency</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="confirm_before_resetting_posting_date" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Confirm before resetting posting date</FormLabel>
                  <FormDescription>If enabled, user will be alerted before resetting posting date to current date in relevant transactions</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analytical Accounting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="enable_accounting_dimensions" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Accounting Dimensions</FormLabel>
                  <FormDescription>Enable cost center, projects and other custom accounting dimensions</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_discounts_and_margin" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Discounts and Margin</FormLabel>
                  <FormDescription>Apply discounts and margins on products</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Journals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="merge_similar_account_heads" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Merge Similar Account Heads</FormLabel>
                  <FormDescription>Rows with Same Account heads will be merged on Ledger</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deferred Accounting Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="book_deferred_entries_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Book Deferred Entries Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>If &quot;Months&quot; is selected, a fixed amount will be booked as deferred revenue or expense for each month irrespective of the number of days in a month. It will be prorated if deferred revenue or expense is not booked for an entire month</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="automatically_process_deferred_accounting_entry" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically Process Deferred Accounting Entry</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="book_deferred_entries_via_journal_entry" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Book Deferred Entries Via Journal Entry</FormLabel>
                  <FormDescription>If this is unchecked, direct GL entries will be created to book deferred revenue or expense</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().book_deferred_entries_via_journal_entry && (
            <FormField control={form.control} name="submit_journal_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Submit Journal Entries</FormLabel>
                  <FormDescription>If this is unchecked Journal Entries will be saved in a Draft state and will have to be submitted manually</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="determine_address_tax_category_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Determine Address Tax Category From</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Billing Address">Billing Address</SelectItem>
                    <SelectItem value="Shipping Address">Shipping Address</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Address used to determine Tax Category in transactions</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="add_taxes_from_item_tax_template" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically Add Taxes and Charges from Item Tax Template</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="add_taxes_from_taxes_and_charges_template" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically Add Taxes from Taxes and Charges Template</FormLabel>
                  <FormDescription>If no taxes are set, and Taxes and Charges Template is selected, the system will automatically apply the taxes from the chosen template.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="book_tax_discount_loss" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Book Tax Loss on Early Payment Discount</FormLabel>
                  <FormDescription>Split Early Payment Discount Loss into Income and Tax Loss</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="round_row_wise_tax" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Round Tax Amount Row-wise</FormLabel>
                  <FormDescription>Tax Amount will be rounded on a row(items) level</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Print Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="show_inclusive_tax_in_print" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Inclusive Tax in Print</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="show_taxes_as_table_in_print" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Taxes as Table in Print</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="show_payment_schedule_in_print" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Payment Schedule in Print</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item Price Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="maintain_same_internal_transaction_rate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Maintain Same Rate Throughout Internal Transaction</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="fetch_valuation_rate_for_internal_transaction" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Fetch Valuation Rate for Internal Transaction</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().maintain_same_internal_transaction_rate && (
            <FormField control={form.control} name="maintain_same_rate_action" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Same Rate is Not Maintained Throughout  Internal Transaction</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().maintain_same_internal_transaction_rate && form.getValues().maintain_same_rate_action === 'Stop' && (
            <FormField control={form.control} name="role_to_override_stop_action" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Override Stop Action (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
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
          <CardTitle className="text-base">Currency Exchange Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="allow_stale" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Stale Exchange Rates</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_pegged_currencies_exchange_rates" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Implicit Pegged Currency Conversion</FormLabel>
                  <FormDescription>System will do an implicit conversion using the pegged currency. &lt;br&gt;
Ex: Instead of AED -&amp;gt; INR, system will do AED -&amp;gt; USD -&amp;gt; INR using the pegged exchange rate of AED against USD.</FormDescription>
                </div>
              </FormItem>
            )} />
            {form.getValues().allow_stale===0 && (
            <FormField control={form.control} name="stale_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stale Days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="payments" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Reconciliation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_reconcile_payments" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Reconcile Payments</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_reconciliation_job_trigger" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Auto Reconciliation Job Trigger</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Interval should be between 1 to 59 MInutes</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reconciliation_queue_size" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reconciliation Queue Size</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Documents Processed on each trigger. Queue Size should be between 5 and 100</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="exchange_gain_loss_posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date Inheritance for Exchange Gain / Loss</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Reconciliation Date">Reconciliation Date</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Only applies for Normal Payments</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="enable_loyalty_point_program" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Loyalty Point Program</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="credit-limits" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credit Limit Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="over_billing_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Over Billing Allowance (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>The percentage you are allowed to bill more against the amount ordered. For example, if the order value is $100 for an item and tolerance is set as 10%, then you are allowed to bill up to $110 </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role_allowed_to_over_bill" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role Allowed to Over Bill  (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Users with this role are allowed to over bill above the allowance percentage</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="credit_controller" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role allowed to bypass Credit Limit (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="assets" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asset Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="calculate_depr_using_total_days" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Calculate daily depreciation using total days in depreciation period</FormLabel>
                  <FormDescription>Enable this option to calculate daily depreciation by considering the total number of days in the entire depreciation period, (including leap years) while using daily pro-rata based depreciation</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="book_asset_depreciation_entry_automatically" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Book Asset Depreciation Entry Automatically</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="role_to_notify_on_depreciation_failure" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Role to Notify on Depreciation Failure (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Users with this role will be notified if the asset depreciation gets failed</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="accounts-closing" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Period Closing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="ignore_account_closing_balance" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Account Closing Balance</FormLabel>
                  <FormDescription>Financial reports will be generated using GL Entry doctypes (should be enabled if Period Closing Voucher is not posted for all years sequentially or missing) </FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="use_legacy_controller_for_pcv" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Legacy Controller For Period Closing Voucher</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remarks Column Length</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="general_ledger_remarks_length" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">General Ledger</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Truncates 'Remarks' column to set character length</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="receivable_payable_remarks_length" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accounts Receivable/Payable</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Truncates 'Remarks' column to set character length</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounts Receivable / Payable Tuning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="receivable_payable_fetch_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Data Fetch Method</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Buffered Cursor">Buffered Cursor</SelectItem>
                    <SelectItem value="UnBuffered Cursor">UnBuffered Cursor</SelectItem>
                    <SelectItem value="Raw SQL">Raw SQL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_ageing_range" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Ageing Range</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legacy Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="ignore_is_opening_check_for_reporting" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Is Opening check for reporting</FormLabel>
                  <FormDescription>Ignores legacy Is Opening field in GL Entry that allows adding opening balance post the system is in use while generating reports</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="others" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chart Of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="show_balance_in_coa" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Balances in Chart Of Accounts</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Banking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="enable_party_matching" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Automatic Party Matching</FormLabel>
                  <FormDescription>Auto match and set the Party in Bank Transactions</FormDescription>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().enable_party_matching && (
            <FormField control={form.control} name="enable_fuzzy_matching" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Fuzzy Matching</FormLabel>
                  <FormDescription>Approximately match the description/party name against parties</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="create_pr_in_draft_status" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Create in Draft Status</FormLabel>
                  <FormDescription>Payment Requests made from Sales / Purchase Invoice will be put in Draft explicitly</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="use_legacy_budget_controller" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Legacy Budget Controller</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}