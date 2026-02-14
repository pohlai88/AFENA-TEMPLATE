"use client";

// Form for Workstation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Workstation } from "../types/workstation.js";
import { WorkstationInsertSchema } from "../types/workstation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkstationFormProps {
  initialData?: Partial<Workstation>;
  onSubmit: (data: Partial<Workstation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WorkstationForm({ initialData = {}, onSubmit, mode, isLoading }: WorkstationFormProps) {
  const form = useForm<Partial<Workstation>>({
    resolver: zodResolver(WorkstationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Workstation" : "New Workstation"}
        </h2>
        <Tabs defaultValue="job-cards" className="w-full">
          <TabsList>
            <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="workstation-status">Workstation Status</TabsTrigger>
            <TabsTrigger value="operating-costs">Operating Costs</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="job-cards" className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="workstation_dashboard" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Workstation Dashboard</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            <FormField control={form.control} name="workstation_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Workstation Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="workstation_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Workstation Type (→ Workstation Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="plant_floor" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Plant Floor (→ Plant Floor)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Plant Floor..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="production_capacity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Capacity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Run parallel job cards in a workstation</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="workstation-status" className="space-y-4">
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Off">Off</SelectItem>
                    <SelectItem value="Idle">Idle</SelectItem>
                    <SelectItem value="Problem">Problem</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Setup">Setup</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Illustration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="on_status_image" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Active Status</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="off_status_image" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Inactive Status</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="operating-costs" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Operating Costs (Per Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Operating Components Cost</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Workstation Cost — integrate with DataTable */}
                <p>Child table for Workstation Cost</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="hour_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Net Hour Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>per hour</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="description" className="space-y-4">
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="working-hours" className="space-y-4">
            <FormField control={form.control} name="holiday_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Holiday List (→ Holiday List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Holiday List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Working Hours</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Workstation Working Hour — integrate with DataTable */}
                <p>Child table for Workstation Working Hour</p>
              </div>
            </div>
            <FormField control={form.control} name="total_working_hours" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Working Hours</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="connections" className="space-y-4">

          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}