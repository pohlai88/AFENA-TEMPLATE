"use client";

// Form for Delivery Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DeliverySettings } from "../types/delivery-settings.js";
import { DeliverySettingsInsertSchema } from "../types/delivery-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliverySettingsFormProps {
  initialData?: Partial<DeliverySettings>;
  onSubmit: (data: Partial<DeliverySettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DeliverySettingsForm({ initialData = {}, onSubmit, mode, isLoading }: DeliverySettingsFormProps) {
  const form = useForm<Partial<DeliverySettings>>({
    resolver: zodResolver(DeliverySettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Delivery Settings" : "New Delivery Settings"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dispatch Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="dispatch_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Dispatch Notification Template (→ Email Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Email Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().send_with_attachment && (
            <FormField control={form.control} name="dispatch_attachment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Dispatch Notification Attachment (→ Print Format)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Print Format..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Leave blank to use the standard Delivery Note format</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="send_with_attachment" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Send with Attachment</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="stop_delay" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delay between Delivery Stops</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>In minutes</FormDescription>
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