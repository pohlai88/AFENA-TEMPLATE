"use client";

// Form for Bank Statement Import
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankStatementImport } from "../types/bank-statement-import.js";
import { BankStatementImportInsertSchema } from "../types/bank-statement-import.js";

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

interface BankStatementImportFormProps {
  initialData?: Partial<BankStatementImport>;
  onSubmit: (data: Partial<BankStatementImport>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankStatementImportForm({ initialData = {}, onSubmit, mode, isLoading }: BankStatementImportFormProps) {
  const form = useForm<Partial<BankStatementImport>>({
    resolver: zodResolver(BankStatementImportInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Statement Import" : "New Bank Statement Import"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bank_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Bank Account (→ Bank Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bank Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().bank_account && (
            <FormField control={form.control} name="bank" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Bank (→ Bank)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bank..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="import_mt940_fromat" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Import MT940 Fromat</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="custom_delimiters" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Custom delimiters</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().custom_delimiters && (
            <FormField control={form.control} name="delimiter_options" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delimiter options</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>If your CSV uses a different delimiter, add that character here, ensuring no spaces or additional characters are included.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && !form.getValues().import_file && (
            <FormField control={form.control} name="google_sheets_url" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Import from Google Sheets</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Must be a publicly accessible Google Sheets URL and adding Bank Account column is necessary for importing via Google Sheets</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && !form.getValues().import_file && (
            <FormField control={form.control} name="html_5" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">html_5</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="import_file" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Import File</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import File Errors and Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="import_warnings" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Import Warnings</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="import_preview" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Import Preview</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Import Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="show_failed_logs" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Show Failed Logs</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="import_log_preview" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Import Log Preview</FormLabel>
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