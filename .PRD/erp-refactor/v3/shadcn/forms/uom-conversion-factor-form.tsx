"use client";

// Form for UOM Conversion Factor
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UomConversionFactor } from "../types/uom-conversion-factor.js";
import { UomConversionFactorInsertSchema } from "../types/uom-conversion-factor.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UomConversionFactorFormProps {
  initialData?: Partial<UomConversionFactor>;
  onSubmit: (data: Partial<UomConversionFactor>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function UomConversionFactorForm({ initialData = {}, onSubmit, mode, isLoading }: UomConversionFactorFormProps) {
  const form = useForm<Partial<UomConversionFactor>>({
    resolver: zodResolver(UomConversionFactorInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "UOM Conversion Factor" : "New UOM Conversion Factor"}
        </h2>
            <FormField control={form.control} name="category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Category (→ UOM Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="from_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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