"use client";

// Form for Service Level Agreement
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ServiceLevelAgreement } from "../types/service-level-agreement.js";
import { ServiceLevelAgreementInsertSchema } from "../types/service-level-agreement.js";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceLevelAgreementFormProps {
  initialData?: Partial<ServiceLevelAgreement>;
  onSubmit: (data: Partial<ServiceLevelAgreement>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ServiceLevelAgreementForm({ initialData = {}, onSubmit, mode, isLoading }: ServiceLevelAgreementFormProps) {
  const form = useForm<Partial<ServiceLevelAgreement>>({
    resolver: zodResolver(ServiceLevelAgreementInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Service Level Agreement" : "New Service Level Agreement"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Apply On (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_priority" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Priority (→ Issue Priority)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Issue Priority..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="service_level" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Service Level Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="enabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enabled</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignment Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_service_level_agreement" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default Service Level Agreement</FormLabel>
                </div>
              </FormItem>
            )} />
            {!form.getValues().default_service_level_agreement && (
            <FormField control={form.control} name="entity_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Entity Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Customer Group">Customer Group</SelectItem>
                    <SelectItem value="Territory">Territory</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().default_service_level_agreement && (
            <FormField control={form.control} name="entity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Entity</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!form.getValues().default_service_level_agreement && (
            <FormField control={form.control} name="condition" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Condition</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Simple Python Expression, Example: doc.status == 'Open' and doc.issue_type == 'Bug'</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valid From</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response and Resolution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="apply_sla_for_resolution" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Apply SLA for Resolution Time</FormLabel>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Priorities</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Service Level Priority — integrate with DataTable */}
                <p>Child table for Service Level Priority</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">SLA Fulfilled On</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: SLA Fulfilled On Status — integrate with DataTable */}
                <p>Child table for SLA Fulfilled On Status</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">SLA Paused On</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pause SLA On Status — integrate with DataTable */}
                <p>Child table for Pause SLA On Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
                {/* Child table: Service Day — integrate with DataTable */}
                <p>Child table for Service Day</p>
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