"use client";

// Form for Contract Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContractTemplate } from "../types/contract-template.js";
import { ContractTemplateInsertSchema } from "../types/contract-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractTemplateFormProps {
  initialData?: Partial<ContractTemplate>;
  onSubmit: (data: Partial<ContractTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ContractTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: ContractTemplateFormProps) {
  const form = useForm<Partial<ContractTemplate>>({
    resolver: zodResolver(ContractTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Contract Template" : "New Contract Template"}
        </h2>
            <FormField control={form.control} name="title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contract_terms" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contract Terms and Conditions</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="requires_fulfilment" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Requires Fulfilment</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().requires_fulfilment===1 && (
            <div className="col-span-2">
              <FormLabel className="">Fulfilment Terms and Conditions</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Contract Template Fulfilment Terms — integrate with DataTable */}
                <p>Child table for Contract Template Fulfilment Terms</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="contract_template_help" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contract Template Help</FormLabel>
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