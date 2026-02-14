"use client";

// Form for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessStatementOfAccounts } from "../types/process-statement-of-accounts.js";
import { ProcessStatementOfAccountsInsertSchema } from "../types/process-statement-of-accounts.js";

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

interface ProcessStatementOfAccountsFormProps {
  initialData?: Partial<ProcessStatementOfAccounts>;
  onSubmit: (data: Partial<ProcessStatementOfAccounts>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessStatementOfAccountsForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessStatementOfAccountsFormProps) {
  const form = useForm<Partial<ProcessStatementOfAccounts>>({
    resolver: zodResolver(ProcessStatementOfAccountsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Statement Of Accounts" : "New Process Statement Of Accounts"}
        </h2>
            <FormField control={form.control} name="report" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Report</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="General Ledger">General Ledger</SelectItem>
                    <SelectItem value="Accounts Receivable">Accounts Receivable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {(!form.getValues().enable_auto_email && form.getValues().report === 'General Ledger'); && (
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {(form.getValues().report === 'General Ledger'); && (
            <FormField control={form.control} name="categorize_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Categorize By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Categorize by Voucher">Categorize by Voucher</SelectItem>
                    <SelectItem value="Categorize by Voucher (Consolidated)">Categorize by Voucher (Consolidated)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <div className="col-span-2">
              <FormLabel className="">Cost Center</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: PSOA Cost Center — integrate with DataTable */}
                <p>Child table for PSOA Cost Center</p>
              </div>
            </div>
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="ignore_exchange_rate_revaluation_journals" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Exchange Rate Revaluation and Gain / Loss Journals</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_cr_dr_notes" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore System Generated Credit / Debit Notes</FormLabel>
                </div>
              </FormItem>
            )} />
            {(!form.getValues().enable_auto_email && form.getValues().report === 'General Ledger'); && (
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="finance_book" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Finance Book (→ Finance Book)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Finance Book..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {(form.getValues().report === 'General Ledger'); && (
            <FormField control={form.control} name="currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().report === 'General Ledger'); && (
            <div className="col-span-2">
              <FormLabel className="">Project</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: PSOA Project — integrate with DataTable */}
                <p>Child table for PSOA Project</p>
              </div>
            </div>
            )}
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="payment_terms_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Terms Template (→ Payment Terms Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Terms Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="sales_partner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner (→ Sales Partner)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Partner..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="sales_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Person (→ Sales Person)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Person..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="show_remarks" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Remarks</FormLabel>
                </div>
              </FormItem>
            )} />
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="based_on_payment_terms" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Based On Payment Terms</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {(form.getValues().report === 'Accounts Receivable'); && (
            <FormField control={form.control} name="show_future_payments" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Future Payments</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="customer_collection" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select Customers By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer Group">Customer Group</SelectItem>
                    <SelectItem value="Territory">Territory</SelectItem>
                    <SelectItem value="Sales Partner">Sales Partner</SelectItem>
                    <SelectItem value="Sales Person">Sales Person</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().customer_collection !==== '' && (
            <FormField control={form.control} name="collection_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Recipient</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="primary_mandatory" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Send To Primary Contact</FormLabel>
                  <FormDescription>A customer must have primary contact email.</FormDescription>
                </div>
              </FormItem>
            )} />
            {(form.getValues().report === 'General Ledger'); && (
            <FormField control={form.control} name="show_net_values_in_party_account" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Net Values in Party Account</FormLabel>
                </div>
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
              <FormLabel className="">Customers</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Process Statement Of Accounts Customer — integrate with DataTable */}
                <p>Child table for Process Statement Of Accounts Customer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Print Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="print_format" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Format (→ Print Format)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Print Format..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="orientation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Orientation</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Landscape">Landscape</SelectItem>
                    <SelectItem value="Portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="include_break" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Page Break After Each SoA</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="include_ageing" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include Ageing Summary</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().include_ageing ==== 1 && (
            <FormField control={form.control} name="ageing_based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Ageing Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Due Date">Due Date</SelectItem>
                    <SelectItem value="Posting Date">Posting Date</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="letter_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Letter Head (→ Letter Head)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Letter Head..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="terms_and_conditions" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Terms and Conditions (→ Terms and Conditions)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Terms and Conditions..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="enable_auto_email" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Auto Email</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="sender" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sender (→ Email Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Email Account..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="frequency" render={({ field: f }) => (
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
                    <SelectItem value="Biweekly">Biweekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="filter_duration" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Filter Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Date</FormLabel>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="pdf_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">PDF Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="subject" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subject</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">CC To</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Process Statement Of Accounts CC — integrate with DataTable */}
                <p>Child table for Process Statement Of Accounts CC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="body" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Body</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="help_text" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Help Text</FormLabel>
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