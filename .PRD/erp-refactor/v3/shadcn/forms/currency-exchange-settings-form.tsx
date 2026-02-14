"use client";

// Form for Currency Exchange Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CurrencyExchangeSettings } from "../types/currency-exchange-settings.js";
import { CurrencyExchangeSettingsInsertSchema } from "../types/currency-exchange-settings.js";

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

interface CurrencyExchangeSettingsFormProps {
  initialData?: Partial<CurrencyExchangeSettings>;
  onSubmit: (data: Partial<CurrencyExchangeSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CurrencyExchangeSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: CurrencyExchangeSettingsFormProps) {
  const form = useForm<Partial<CurrencyExchangeSettings>>({
    resolver: zodResolver(CurrencyExchangeSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Currency Exchange Settings" : "New Currency Exchange Settings"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            <FormField control={form.control} name="service_provider" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Provider</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frankfurter.dev">frankfurter.dev</SelectItem>
                    <SelectItem value="exchangerate.host">exchangerate.host</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="api_endpoint" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">API Endpoint</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().service_provider !== "Custom" && (
            <FormField control={form.control} name="use_http" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use HTTP Protocol</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().service_provider === 'exchangerate.host'; && (
            <FormField control={form.control} name="access_key" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Access Key</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="url" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Example URL</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="help" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Help</FormLabel>
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
          <CardTitle className="text-base">Request Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Parameters</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Currency Exchange Settings Details — integrate with DataTable */}
                <p>Child table for Currency Exchange Settings Details</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">Result Key</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Currency Exchange Settings Result — integrate with DataTable */}
                <p>Child table for Currency Exchange Settings Result</p>
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