"use client";

// Form for Prospect
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prospect } from "../types/prospect.js";
import { ProspectInsertSchema } from "../types/prospect.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProspectFormProps {
  initialData?: Partial<Prospect>;
  onSubmit: (data: Partial<Prospect>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProspectForm({ initialData = {}, onSubmit, mode, isLoading }: ProspectFormProps) {
  const form = useForm<Partial<Prospect>>({
    resolver: zodResolver(ProspectInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.company_name as string) ?? "Prospect" : "New Prospect"}
          </h2>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="address-&-contact">Address & Contact</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <FormField control={form.control} name="company_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_of_employees" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No. of Employees</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="annual_revenue" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Annual Revenue</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="market_segment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Market Segment (→ Market Segment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Market Segment..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="industry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Industry (→ Industry Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Industry Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="prospect_owner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Prospect Owner (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Website</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fax" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fax</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="address-&-contact" className="space-y-4">
            <FormField control={form.control} name="address_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="leads" className="space-y-4">
            <div className="col-span-2">
              <FormLabel className="">leads</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Prospect Lead — integrate with DataTable */}
                <p>Child table for Prospect Lead</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="opportunities" className="space-y-4">
            <div className="col-span-2">
              <FormLabel className="">Opportunities</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Prospect Opportunity — integrate with DataTable */}
                <p>Child table for Prospect Opportunity</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="activities" className="space-y-4">
            <FormField control={form.control} name="open_activities_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Open Activities HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="all_activities_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">All Activities HTML</FormLabel>
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
          <TabsContent value="comments" className="space-y-4">
            <FormField control={form.control} name="notes_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Notes HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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