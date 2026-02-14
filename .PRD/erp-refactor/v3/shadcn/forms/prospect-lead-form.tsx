"use client";

// Form for Prospect Lead
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProspectLead } from "../types/prospect-lead.js";
import { ProspectLeadInsertSchema } from "../types/prospect-lead.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProspectLeadFormProps {
  initialData?: Partial<ProspectLead>;
  onSubmit: (data: Partial<ProspectLead>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProspectLeadForm({ initialData = {}, onSubmit, mode, isLoading }: ProspectLeadFormProps) {
  const form = useForm<Partial<ProspectLead>>({
    resolver: zodResolver(ProspectLeadInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Prospect Lead" : "New Prospect Lead"}
        </h2>
            <FormField control={form.control} name="lead" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lead (→ Lead)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Lead..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lead_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lead Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mobile_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mobile No</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lead_owner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lead Owner</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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