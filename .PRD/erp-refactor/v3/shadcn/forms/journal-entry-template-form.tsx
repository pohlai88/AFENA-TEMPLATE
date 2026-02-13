"use client";

// Form for Journal Entry Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JournalEntryTemplate } from "../types/journal-entry-template.js";
import { JournalEntryTemplateInsertSchema } from "../types/journal-entry-template.js";

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

interface JournalEntryTemplateFormProps {
  initialData?: Partial<JournalEntryTemplate>;
  onSubmit: (data: Partial<JournalEntryTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function JournalEntryTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: JournalEntryTemplateFormProps) {
  const form = useForm<Partial<JournalEntryTemplate>>({
    resolver: zodResolver(JournalEntryTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.template_title as string) ?? "Journal Entry Template" : "New Journal Entry Template"}
          </h2>
        </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="template_title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Template Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Journal Entry Type</FormLabel>
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
                    <SelectItem value="Exchange Rate Revaluation">Exchange Rate Revaluation</SelectItem>
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
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Accounting Entries</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Journal Entry Template Account — integrate with DataTable */}
                <p>Child table for Journal Entry Template Account</p>
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