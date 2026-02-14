"use client";

// Form for Asset Activity
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetActivity } from "../types/asset-activity.js";
import { AssetActivityInsertSchema } from "../types/asset-activity.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetActivityFormProps {
  initialData?: Partial<AssetActivity>;
  onSubmit: (data: Partial<AssetActivity>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetActivityForm({ initialData = {}, onSubmit, mode, isLoading }: AssetActivityFormProps) {
  const form = useForm<Partial<AssetActivity>>({
    resolver: zodResolver(AssetActivityInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Activity" : "New Asset Activity"}
        </h2>
            <FormField control={form.control} name="asset" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="user" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">User (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="subject" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Subject</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
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