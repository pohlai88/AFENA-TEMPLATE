"use client";

// Form for Quality Procedure Process
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityProcedureProcess } from "../types/quality-procedure-process.js";
import { QualityProcedureProcessInsertSchema } from "../types/quality-procedure-process.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QualityProcedureProcessFormProps {
  initialData?: Partial<QualityProcedureProcess>;
  onSubmit: (data: Partial<QualityProcedureProcess>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityProcedureProcessForm({ initialData = {}, onSubmit, mode, isLoading }: QualityProcedureProcessFormProps) {
  const form = useForm<Partial<QualityProcedureProcess>>({
    resolver: zodResolver(QualityProcedureProcessInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Procedure Process" : "New Quality Procedure Process"}
        </h2>
            <FormField control={form.control} name="process_description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Process Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="procedure" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sub Procedure (→ Quality Procedure)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Procedure..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Link existing Quality Procedure.</FormDescription>
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