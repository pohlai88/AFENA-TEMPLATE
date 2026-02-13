"use client";

// Form for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChartOfAccountsImporter } from "../types/chart-of-accounts-importer.js";
import { ChartOfAccountsImporterInsertSchema } from "../types/chart-of-accounts-importer.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartOfAccountsImporterFormProps {
  initialData?: Partial<ChartOfAccountsImporter>;
  onSubmit: (data: Partial<ChartOfAccountsImporter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ChartOfAccountsImporterForm({ initialData = {}, onSubmit, mode, isLoading }: ChartOfAccountsImporterFormProps) {
  const form = useForm<Partial<ChartOfAccountsImporter>>({
    resolver: zodResolver(ChartOfAccountsImporterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Chart of Accounts Importer" : "New Chart of Accounts Importer"}
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
            {!!form.getValues().company && (
            <FormField control={form.control} name="import_file" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Attach custom Chart of Accounts file</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chart Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="chart_tree" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Chart Tree</FormLabel>
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