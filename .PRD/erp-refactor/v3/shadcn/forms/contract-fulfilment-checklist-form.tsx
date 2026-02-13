"use client";

// Form for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContractFulfilmentChecklist } from "../types/contract-fulfilment-checklist.js";
import { ContractFulfilmentChecklistInsertSchema } from "../types/contract-fulfilment-checklist.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractFulfilmentChecklistFormProps {
  initialData?: Partial<ContractFulfilmentChecklist>;
  onSubmit: (data: Partial<ContractFulfilmentChecklist>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ContractFulfilmentChecklistForm({ initialData = {}, onSubmit, mode, isLoading }: ContractFulfilmentChecklistFormProps) {
  const form = useForm<Partial<ContractFulfilmentChecklist>>({
    resolver: zodResolver(ContractFulfilmentChecklistInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Contract Fulfilment Checklist" : "New Contract Fulfilment Checklist"}
        </h2>
            <FormField control={form.control} name="fulfilled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Fulfilled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="requirement" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Requirement</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="notes" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Notes</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Contract Fulfilment Checklist)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contract Fulfilment Checklist..." {...f} value={(f.value as string) ?? ""} disabled />
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