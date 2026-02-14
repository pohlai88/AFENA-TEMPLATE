"use client";

// Form for Projects Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectsSettings } from "../types/projects-settings.js";
import { ProjectsSettingsInsertSchema } from "../types/projects-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectsSettingsFormProps {
  initialData?: Partial<ProjectsSettings>;
  onSubmit: (data: Partial<ProjectsSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProjectsSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: ProjectsSettingsFormProps) {
  const form = useForm<Partial<ProjectsSettings>>({
    resolver: zodResolver(ProjectsSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Projects Settings" : "New Projects Settings"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timesheets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="ignore_workstation_time_overlap" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Workstation Time Overlap</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_user_time_overlap" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore User Time Overlap</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="ignore_employee_time_overlap" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Ignore Employee Time Overlap</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="fetch_timesheet_in_sales_invoice" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Fetch Timesheet in Sales Invoice</FormLabel>
                  <FormDescription>Enabling the check box will fetch timesheet on select of a Project in Sales Invoice</FormDescription>
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