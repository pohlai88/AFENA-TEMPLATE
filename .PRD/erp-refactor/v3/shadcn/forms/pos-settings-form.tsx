"use client";

// Form for POS Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosSettings } from "../types/pos-settings.js";
import { PosSettingsInsertSchema } from "../types/pos-settings.js";

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

interface PosSettingsFormProps {
  initialData?: Partial<PosSettings>;
  onSubmit: (data: Partial<PosSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: PosSettingsFormProps) {
  const form = useForm<Partial<PosSettings>>({
    resolver: zodResolver(PosSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Settings" : "New POS Settings"}
        </h2>
            <FormField control={form.control} name="invoice_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Type Created via POS Screen</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                    <SelectItem value="POS Invoice">POS Invoice</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The system will create a Sales Invoice or a POS Invoice from the POS interface based on this setting. For high-volume transactions, it is recommended to use POS Invoice.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="post_change_gl_entries" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Create Ledger Entries for Change Amount</FormLabel>
                  <FormDescription>If enabled, ledger entries will be posted for change amount in POS transactions</FormDescription>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">POS Additional Fields</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: POS Field — integrate with DataTable */}
                <p>Child table for POS Field</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">POS Search Fields</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: POS Search Fields — integrate with DataTable */}
                <p>Child table for POS Search Fields</p>
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