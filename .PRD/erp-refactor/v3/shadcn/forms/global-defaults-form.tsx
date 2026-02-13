"use client";

// Form for Global Defaults
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GlobalDefaults } from "../types/global-defaults.js";
import { GlobalDefaultsInsertSchema } from "../types/global-defaults.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GlobalDefaultsFormProps {
  initialData?: Partial<GlobalDefaults>;
  onSubmit: (data: Partial<GlobalDefaults>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function GlobalDefaultsForm({ initialData = {}, onSubmit, mode, isLoading }: GlobalDefaultsFormProps) {
  const form = useForm<Partial<GlobalDefaults>>({
    resolver: zodResolver(GlobalDefaultsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Global Defaults" : "New Global Defaults"}
        </h2>
            <FormField control={form.control} name="default_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="default_distance_unit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Distance Unit (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="hide_currency_symbol" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Hide Currency Symbol</FormLabel>
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
                <FormDescription>Do not show any symbol like $ etc next to currencies.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disable_rounded_total" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Rounded Total</FormLabel>
                  <FormDescription>If disable, 'Rounded Total' field will not be visible in any transaction</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="disable_in_words" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable In Words</FormLabel>
                  <FormDescription>If disable, 'In Words' field will not be visible in any transaction</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="use_posting_datetime_for_naming_documents" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Posting Datetime for Naming Documents</FormLabel>
                  <FormDescription>When checked, the system will use the posting datetime of the document for naming the document instead of the creation datetime of the document.</FormDescription>
                </div>
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}