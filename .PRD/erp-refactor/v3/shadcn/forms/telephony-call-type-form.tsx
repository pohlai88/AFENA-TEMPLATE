"use client";

// Form for Telephony Call Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TelephonyCallType } from "../types/telephony-call-type.js";
import { TelephonyCallTypeInsertSchema } from "../types/telephony-call-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TelephonyCallTypeFormProps {
  initialData?: Partial<TelephonyCallType>;
  onSubmit: (data: Partial<TelephonyCallType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TelephonyCallTypeForm({ initialData = {}, onSubmit, mode, isLoading }: TelephonyCallTypeFormProps) {
  const form = useForm<Partial<TelephonyCallType>>({
    resolver: zodResolver(TelephonyCallTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Telephony Call Type" : "New Telephony Call Type"}
        </h2>
            <FormField control={form.control} name="call_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Call Type</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Telephony Call Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Telephony Call Type..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}