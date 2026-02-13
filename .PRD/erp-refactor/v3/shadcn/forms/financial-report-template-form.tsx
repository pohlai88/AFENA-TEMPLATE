"use client";

// Form for Financial Report Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FinancialReportTemplate } from "../types/financial-report-template.js";
import { FinancialReportTemplateInsertSchema } from "../types/financial-report-template.js";

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

interface FinancialReportTemplateFormProps {
  initialData?: Partial<FinancialReportTemplate>;
  onSubmit: (data: Partial<FinancialReportTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function FinancialReportTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: FinancialReportTemplateFormProps) {
  const form = useForm<Partial<FinancialReportTemplate>>({
    resolver: zodResolver(FinancialReportTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.template_name as string) ?? "Financial Report Template" : "New Financial Report Template"}
          </h2>
        </div>
            <FormField control={form.control} name="template_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Template Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Descriptive name for your template (e.g., 'Standard P&amp;L', 'Detailed Balance Sheet')</FormDescription>
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
                    <SelectItem value="Profit and Loss Statement">Profit and Loss Statement</SelectItem>
                    <SelectItem value="Balance Sheet">Balance Sheet</SelectItem>
                    <SelectItem value="Cash Flow">Cash Flow</SelectItem>
                    <SelectItem value="Custom Financial Statement">Custom Financial Statement</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type of financial statement this template generates</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {frappe.boot.developer_mode && (
            <FormField control={form.control} name="module" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Module (for Export) (→ Module Def)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Module Def..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                  <FormDescription>Disable template to prevent use in reports</FormDescription>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Report Line Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Financial Report Row — integrate with DataTable */}
                <p>Child table for Financial Report Row</p>
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