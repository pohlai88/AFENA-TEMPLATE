"use client";

// Form for Bisect Nodes
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BisectNodes } from "../types/bisect-nodes.js";
import { BisectNodesInsertSchema } from "../types/bisect-nodes.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface BisectNodesFormProps {
  initialData?: Partial<BisectNodes>;
  onSubmit: (data: Partial<BisectNodes>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BisectNodesForm({ initialData = {}, onSubmit, mode, isLoading }: BisectNodesFormProps) {
  const form = useForm<Partial<BisectNodes>>({
    resolver: zodResolver(BisectNodesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bisect Nodes" : "New Bisect Nodes"}
        </h2>
            <FormField control={form.control} name="root" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Root (→ Bisect Nodes)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bisect Nodes..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="left_child" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Left Child (→ Bisect Nodes)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bisect Nodes..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="right_child" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Right Child (→ Bisect Nodes)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bisect Nodes..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="period_from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Period_from_date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="period_to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Period To Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="difference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Difference</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="balance_sheet_summary" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Balance Sheet Summary</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="profit_loss_summary" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Profit and Loss Summary</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="generated" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Generated</FormLabel>
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