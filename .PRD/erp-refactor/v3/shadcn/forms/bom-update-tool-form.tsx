"use client";

// Form for BOM Update Tool
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BomUpdateTool } from "../types/bom-update-tool.js";
import { BomUpdateToolInsertSchema } from "../types/bom-update-tool.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BomUpdateToolFormProps {
  initialData?: Partial<BomUpdateTool>;
  onSubmit: (data: Partial<BomUpdateTool>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BomUpdateToolForm({ initialData = {}, onSubmit, mode, isLoading }: BomUpdateToolFormProps) {
  const form = useForm<Partial<BomUpdateTool>>({
    resolver: zodResolver(BomUpdateToolInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "BOM Update Tool" : "New BOM Update Tool"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Replace BOM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="current_bom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Current BOM (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>The BOM which will be replaced</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="new_bom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">New BOM (→ BOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search BOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>The new BOM after replacement</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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