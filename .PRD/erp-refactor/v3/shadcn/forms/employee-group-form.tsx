"use client";

// Form for Employee Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeGroup } from "../types/employee-group.js";
import { EmployeeGroupInsertSchema } from "../types/employee-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeeGroupFormProps {
  initialData?: Partial<EmployeeGroup>;
  onSubmit: (data: Partial<EmployeeGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeGroupForm({ initialData = {}, onSubmit, mode, isLoading }: EmployeeGroupFormProps) {
  const form = useForm<Partial<EmployeeGroup>>({
    resolver: zodResolver(EmployeeGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Employee Group" : "New Employee Group"}
        </h2>
            <FormField control={form.control} name="employee_group_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Employee</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Employee Group Table — integrate with DataTable */}
                <p>Child table for Employee Group Table</p>
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