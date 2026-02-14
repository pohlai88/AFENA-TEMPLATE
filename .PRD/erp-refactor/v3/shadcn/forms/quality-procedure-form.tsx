"use client";

// Form for Quality Procedure
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityProcedure } from "../types/quality-procedure.js";
import { QualityProcedureInsertSchema } from "../types/quality-procedure.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityProcedureFormProps {
  initialData?: Partial<QualityProcedure>;
  onSubmit: (data: Partial<QualityProcedure>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityProcedureForm({ initialData = {}, onSubmit, mode, isLoading }: QualityProcedureFormProps) {
  const form = useForm<Partial<QualityProcedure>>({
    resolver: zodResolver(QualityProcedureInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Procedure" : "New Quality Procedure"}
        </h2>
            <FormField control={form.control} name="quality_procedure_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quality Procedure</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="process_owner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Process Owner (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Processes</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Quality Procedure Process — integrate with DataTable */}
                <p>Child table for Quality Procedure Process</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="parent_quality_procedure" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parent Procedure (→ Quality Procedure)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quality Procedure..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_group" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Group</FormLabel>
                </div>
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