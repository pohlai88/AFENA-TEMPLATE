"use client";

// Form for Workstation Operating Component
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WorkstationOperatingComponent } from "../types/workstation-operating-component.js";
import { WorkstationOperatingComponentInsertSchema } from "../types/workstation-operating-component.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkstationOperatingComponentFormProps {
  initialData?: Partial<WorkstationOperatingComponent>;
  onSubmit: (data: Partial<WorkstationOperatingComponent>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WorkstationOperatingComponentForm({ initialData = {}, onSubmit, mode, isLoading }: WorkstationOperatingComponentFormProps) {
  const form = useForm<Partial<WorkstationOperatingComponent>>({
    resolver: zodResolver(WorkstationOperatingComponentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Workstation Operating Component" : "New Workstation Operating Component"}
        </h2>
            <FormField control={form.control} name="component_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Component Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Component Expense Account</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Workstation Operating Component Account — integrate with DataTable */}
                <p>Child table for Workstation Operating Component Account</p>
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