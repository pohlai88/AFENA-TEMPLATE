"use client";

// Form for Target Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TargetDetail } from "../types/target-detail.js";
import { TargetDetailInsertSchema } from "../types/target-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TargetDetailFormProps {
  initialData?: Partial<TargetDetail>;
  onSubmit: (data: Partial<TargetDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TargetDetailForm({ initialData = {}, onSubmit, mode, isLoading }: TargetDetailFormProps) {
  const form = useForm<Partial<TargetDetail>>({
    resolver: zodResolver(TargetDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Target Detail" : "New Target Detail"}
        </h2>
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="target_qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Qty</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="target_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target  Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="distribution_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target Distribution (→ Monthly Distribution)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Monthly Distribution..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
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