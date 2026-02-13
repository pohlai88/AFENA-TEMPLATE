"use client";

// Form for Financial Report Row
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FinancialReportRow } from "../types/financial-report-row.js";
import { FinancialReportRowInsertSchema } from "../types/financial-report-row.js";

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

interface FinancialReportRowFormProps {
  initialData?: Partial<FinancialReportRow>;
  onSubmit: (data: Partial<FinancialReportRow>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function FinancialReportRowForm({ initialData = {}, onSubmit, mode, isLoading }: FinancialReportRowFormProps) {
  const form = useForm<Partial<FinancialReportRow>>({
    resolver: zodResolver(FinancialReportRowInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Financial Report Row" : "New Financial Report Row"}
        </h2>
            <FormField control={form.control} name="reference_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Line Reference</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Code to reference this line in formulas (e.g., REV100, EXP200, ASSET100)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="display_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Display Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Text displayed on the financial statement (e.g., 'Total Revenue', 'Cash and Cash Equivalents')</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="indentation_level" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Indent Level</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Indentation level: 0 = Main heading, 1 = Sub-category, 2 = Individual accounts, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="data_source" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Data Source</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Account Data">Account Data</SelectItem>
                    <SelectItem value="Calculated Amount">Calculated Amount</SelectItem>
                    <SelectItem value="Custom API">Custom API</SelectItem>
                    <SelectItem value="Blank Line">Blank Line</SelectItem>
                    <SelectItem value="Column Break">Column Break</SelectItem>
                    <SelectItem value="Section Break">Section Break</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How this line gets its data</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().data_source === 'Account Data' && (
            <FormField control={form.control} name="balance_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Balance Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Opening Balance">Opening Balance</SelectItem>
                    <SelectItem value="Closing Balance">Closing Balance</SelectItem>
                    <SelectItem value="Period Movement (Debits - Credits)">Period Movement (Debits - Credits)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Opening Balance = Start of period, Closing Balance = End of period, Period Movement = Net change during period</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="fieldtype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Currency">Currency</SelectItem>
                    <SelectItem value="Float">Float</SelectItem>
                    <SelectItem value="Int">Int</SelectItem>
                    <SelectItem value="Percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How to format and present values in the financial report (only if different from column fieldtype)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="color" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Color</FormLabel>
                <FormControl>
                  <Input type="color" className="h-10 w-20" {...f} value={(f.value as string) ?? "#000000"} />
                </FormControl>
                <FormDescription>Color to highlight values (e.g., red for exceptions)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bold_text" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Bold Text</FormLabel>
                  <FormDescription>Bold text for emphasis (totals, major headings)</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="italic_text" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Italic Text</FormLabel>
                  <FormDescription>Italic text for subtotals or notes</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="hidden_calculation" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Hidden Line (Internal Use Only)</FormLabel>
                  <FormDescription>Calculate but don't show on final report</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="hide_when_empty" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Hide If Zero</FormLabel>
                  <FormDescription>Hide this line if amount is zero</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="reverse_sign" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Reverse Sign</FormLabel>
                  <FormDescription>Show negative values as positive (for expenses in P&amp;L)</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="include_in_charts" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Include in Charts</FormLabel>
                  <FormDescription>If enabled, this row's values will be displayed on financial charts</FormDescription>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().data_source ==== "Account Data" && (
            <FormField control={form.control} name="advanced_filtering" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Advanced Filtering</FormLabel>
                  <FormDescription>Use &lt;strong&gt;Python&lt;/strong&gt; filters to get Accounts</FormDescription>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().data_source ==== "Account Data" && !form.getValues().advanced_filtering && (
            <FormField control={form.control} name="filters_editor" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">filters_editor</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {(form.getValues().data_source ==== "Account Data" && form.getValues().advanced_filtering) || ["Calculated Amount", "Custom API"].includes(form.getValues().data_source); && (
            <FormField control={form.control} name="calculation_formula" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Formula or Account Filter</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="formula_description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">formula_description</FormLabel>
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