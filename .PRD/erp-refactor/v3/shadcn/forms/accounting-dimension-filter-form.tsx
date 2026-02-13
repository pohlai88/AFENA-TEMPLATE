"use client";

// Form for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountingDimensionFilter } from "../types/accounting-dimension-filter.js";
import { AccountingDimensionFilterInsertSchema } from "../types/accounting-dimension-filter.js";

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

interface AccountingDimensionFilterFormProps {
  initialData?: Partial<AccountingDimensionFilter>;
  onSubmit: (data: Partial<AccountingDimensionFilter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountingDimensionFilterForm({ initialData = {}, onSubmit, mode, isLoading }: AccountingDimensionFilterFormProps) {
  const form = useForm<Partial<AccountingDimensionFilter>>({
    resolver: zodResolver(AccountingDimensionFilterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Accounting Dimension Filter" : "New Accounting Dimension Filter"}
        </h2>
            <FormField control={form.control} name="accounting_dimension" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accounting Dimension</FormLabel>
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
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
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
            <FormField control={form.control} name="apply_restriction_on_values" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply restriction on dimension values</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().apply_restriction_on_values === 1; && (
            <FormField control={form.control} name="allow_or_restrict" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Allow Or Restrict Dimension</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Allow">Allow</SelectItem>
                    <SelectItem value="Restrict">Restrict</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Applicable On Account</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Applicable On Account — integrate with DataTable */}
                <p>Child table for Applicable On Account</p>
              </div>
            </div>
            {form.getValues().accounting_dimension && form.getValues().apply_restriction_on_values && (
            <div className="col-span-2">
              <FormLabel className="">Applicable Dimension</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Allowed Dimension — integrate with DataTable */}
                <p>Child table for Allowed Dimension</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="dimension_filter_help" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Dimension Filter Help</FormLabel>
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