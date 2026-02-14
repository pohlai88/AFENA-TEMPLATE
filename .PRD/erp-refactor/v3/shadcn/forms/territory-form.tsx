"use client";

// Form for Territory
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Territory } from "../types/territory.js";
import { TerritoryInsertSchema } from "../types/territory.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TerritoryFormProps {
  initialData?: Partial<Territory>;
  onSubmit: (data: Partial<Territory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TerritoryForm({ initialData = {}, onSubmit, mode, isLoading }: TerritoryFormProps) {
  const form = useForm<Partial<Territory>>({
    resolver: zodResolver(TerritoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Territory" : "New Territory"}
        </h2>
            <FormField control={form.control} name="territory_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="parent_territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Parent Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_group" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-semibold">Is Group</FormLabel>
                  <FormDescription>Only leaf nodes are allowed in transaction</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="territory_manager" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory Manager (→ Sales Person)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Person..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>For reference</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Territory Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Targets</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Target Detail — integrate with DataTable */}
                <p>Child table for Target Detail</p>
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