"use client";

// Form for CRM Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CrmSettings } from "../types/crm-settings.js";
import { CrmSettingsInsertSchema } from "../types/crm-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrmSettingsFormProps {
  initialData?: Partial<CrmSettings>;
  onSubmit: (data: Partial<CrmSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CrmSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: CrmSettingsFormProps) {
  const form = useForm<Partial<CrmSettings>>({
    resolver: zodResolver(CrmSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "CRM Settings" : "New CRM Settings"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="campaign_naming_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Campaign Naming By</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Campaign Name">Campaign Name</SelectItem>
                    <SelectItem value="Naming Series">Naming Series</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_lead_duplication_based_on_emails" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Lead Duplication based on Emails</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="auto_creation_of_contact" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Auto Creation of Contact</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="close_opportunity_after_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Close Replied Opportunity After Days</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Auto close Opportunity Replied after the no. of days mentioned above</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_valid_till" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Quotation Validity Days</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="carry_forward_communication_and_comments" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Carry Forward Communication and Comments</FormLabel>
                  <FormDescription>All the Comments and Emails will be copied from one document to another newly created document(Lead -&gt; Opportunity -&gt; Quotation) throughout the CRM documents.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="update_timestamp_on_new_communication" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Update timestamp on new communication</FormLabel>
                  <FormDescription>Update the modified timestamp on new communications received in Lead &amp; Opportunity.</FormDescription>
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