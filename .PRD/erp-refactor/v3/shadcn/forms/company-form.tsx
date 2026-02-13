"use client";

// Form for Company
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Company } from "../types/company.js";
import { CompanyInsertSchema } from "../types/company.js";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CompanyForm({ initialData = {}, onSubmit, mode, isLoading }: CompanyFormProps) {
  const form = useForm<Partial<Company>>({
    resolver: zodResolver(CompanyInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Company" : "New Company"}
        </h2>
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="accounts-closing">Accounts Closing</TabsTrigger>
            <TabsTrigger value="buying-and-selling">Buying and Selling</TabsTrigger>
            <TabsTrigger value="stock-and-manufacturing">Stock and Manufacturing</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="accounts" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="company_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="abbr" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Abbr</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
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
                  <FormLabel className="font-semibold">Is Group</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="default_holiday_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Holiday List (→ Holiday List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Holiday List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_letter_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Letter Head (→ Letter Head)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Letter Head..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="domain" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Domain</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="date_of_establishment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date of Establishment</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="parent_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parent Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reporting_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reporting Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address & Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="date_of_incorporation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date of Incorporation</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Phone No</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company_description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Company Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().date_of_incorporation && (
            <FormField control={form.control} name="date_of_commencement" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date of Commencement</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="fax" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fax</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Website</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">address_html</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="registration_details" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Registration Details</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Company registration numbers for your reference. Tax numbers etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="create_chart_of_accounts_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Create Chart Of Accounts Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Standard Template">Standard Template</SelectItem>
                    <SelectItem value="Existing Company">Existing Company</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().create_chart_of_accounts_based_on===="Existing Company" && (
            <FormField control={form.control} name="existing_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Existing Company  (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().create_chart_of_accounts_based_on===="Standard Template" && (
            <FormField control={form.control} name="chart_of_accounts" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Chart Of Accounts Template</FormLabel>
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
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_bank_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Bank Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_cash_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Cash Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_receivable_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Receivable Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_payable_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Payable Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="write_off_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Write Off Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="unrealized_profit_loss_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Unrealized Profit / Loss Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().parent_company && (
            <FormField control={form.control} name="allow_account_creation_against_child_company" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Account Creation Against Child Company</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Cost of Goods Sold Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_income_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Income Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="default_discount_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Payment Discount Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_terms" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Payment Terms Template (→ Payment Terms Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Terms Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="default_finance_book" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Finance Book (→ Finance Book)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Finance Book..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exchange Gain / Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="exchange_gain_loss_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Gain / Loss Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="unrealized_exchange_gain_loss_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Unrealized Exchange Gain/Loss Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Round Off</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="round_off_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Round Off Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="round_off_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Round Off Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="round_off_for_opening" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Round Off for Opening (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deferred Accounting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_deferred_revenue_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Deferred Revenue Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="default_deferred_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Deferred Expense Account (→ Account)</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Advance Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="book_advance_payments_in_separate_party_account" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Book Advance Payments in Separate Party Account</FormLabel>
                  <FormDescription>Enabling this option will allow you to record - &lt;br&gt;&lt;br&gt; 1. Advances Received in a &lt;b&gt;Liability Account&lt;/b&gt; instead of the &lt;b&gt;Asset Account&lt;/b&gt;&lt;br&gt;&lt;br&gt;2. Advances Paid in an &lt;b&gt;Asset Account&lt;/b&gt; instead of the &lt;b&gt; Liability Account&lt;/b&gt;</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="reconciliation_takes_effect_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reconciliation Takes Effect On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Advance Payment Date">Advance Payment Date</SelectItem>
                    <SelectItem value="Oldest Of Invoice Or Advance">Oldest Of Invoice Or Advance</SelectItem>
                    <SelectItem value="Reconciliation Date">Reconciliation Date</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().book_advance_payments_in_separate_party_account && (
            <FormField control={form.control} name="default_advance_received_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Advance Received Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Only 'Payment Entries' made against this advance account are supported.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().book_advance_payments_in_separate_party_account && (
            <FormField control={form.control} name="default_advance_paid_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Advance Paid Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Only 'Payment Entries' made against this advance account are supported.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exchange Rate Revaluation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="auto_exchange_rate_revaluation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Create Exchange Rate Revaluation</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_err_frequency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Frequency</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="submit_err_jv" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Submit ERR Journals?</FormLabel>
                  <FormDescription>Upon enabling this, the JV will be submitted for a different exchange rate.</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="exception_budget_approver_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exception Budget Approver Role (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fixed Asset Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="accumulated_depreciation_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accumulated Depreciation Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="series_for_depreciation_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Series for Asset Depreciation Entry (Journal Entry)</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disposal_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Gain/Loss Account on Asset Disposal (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Depreciation Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="capital_work_in_progress_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Capital Work In Progress Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="asset_received_but_not_billed" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Received But Not Billed (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="accounts-closing" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="accounts_frozen_till_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accounts Frozen Till Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Accounting entries are frozen up to this date. Only users with the specified role can create or modify entries before this date.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role_allowed_for_frozen_entries" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Roles Allowed to Set and Edit Frozen Account Entries (→ Role)</FormLabel>
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
          <TabsContent value="buying-and-selling" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buying & Selling Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_buying_terms" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Buying Terms (→ Terms and Conditions)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Terms and Conditions..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="monthly_sales_target" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Monthly Sales Target</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_monthly_sales" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Monthly Sales</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_selling_terms" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Selling Terms (→ Terms and Conditions)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Terms and Conditions..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_sales_contact" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Sales Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_warehouse_for_sales_return" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Warehouse for Sales Return (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="credit_limit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Credit Limit</FormLabel>
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
          <CardTitle className="text-base">Purchase Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="purchase_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="service_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>For service item</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="purchase_expense_contra_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Expense Contra Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="stock-and-manufacturing" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="enable_perpetual_inventory" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Perpetual Inventory</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_item_wise_inventory_account" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Item-wise Inventory Account</FormLabel>
                  <FormDescription>If enabled, the system will use the inventory account set in the Item Master or Item Group or Brand. Otherwise, it will use the inventory account set in the Warehouse.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="enable_provisional_accounting_for_non_stock_items" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Provisional Accounting For Non Stock Items</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="default_inventory_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Inventory Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valuation_method" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Stock Valuation Method</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO</SelectItem>
                    <SelectItem value="Moving Average">Moving Average</SelectItem>
                    <SelectItem value="LIFO">LIFO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_adjustment_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Adjustment Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="stock_received_but_not_billed" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stock Received But Not Billed (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_provisional_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Provisional Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_in_transit_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default In-Transit Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manufacturing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_operating_cost_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Operating Cost Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_wip_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className=""> Default Work In Progress Warehouse  (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_fg_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Finished Goods Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_scrap_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Scrap Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="dashboard" className="space-y-4">

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