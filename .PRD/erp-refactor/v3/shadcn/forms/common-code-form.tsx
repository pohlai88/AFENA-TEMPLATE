"use client";

// Form for Common Code
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CommonCode } from "../types/common-code.js";
import { CommonCodeInsertSchema } from "../types/common-code.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommonCodeFormProps {
  initialData?: Partial<CommonCode>;
  onSubmit: (data: Partial<CommonCode>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CommonCodeForm({ initialData = {}, onSubmit, mode, isLoading }: CommonCodeFormProps) {
  const form = useForm<Partial<CommonCode>>({
    resolver: zodResolver(CommonCodeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Common Code" : "New Common Code"}
          </h2>
        </div>
            <FormField control={form.control} name="code_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Code List (→ Code List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Code List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="canonical_uri" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Canonical URI</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="common_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Common Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="additional_data" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Additional Data</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Applies To</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Dynamic Link — integrate with DataTable */}
                <p>Child table for Dynamic Link</p>
              </div>
            </div>
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