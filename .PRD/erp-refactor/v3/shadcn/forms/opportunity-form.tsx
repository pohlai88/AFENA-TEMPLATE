"use client";

// Form for Opportunity
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Opportunity } from "../types/opportunity.js";
import { OpportunityInsertSchema } from "../types/opportunity.js";

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

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  onSubmit: (data: Partial<Opportunity>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function OpportunityForm({ initialData = {}, onSubmit, mode, isLoading }: OpportunityFormProps) {
  const form = useForm<Partial<Opportunity>>({
    resolver: zodResolver(OpportunityInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Opportunity" : "New Opportunity"}
          </h2>
        </div>
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts" className="space-y-4">
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="opportunity_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity From (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="party_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Party</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Quotation">Quotation</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="opportunity_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Type (→ Opportunity Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Opportunity Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="opportunity_owner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Owner (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sales_stage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Stage (→ Sales Stage)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Stage..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expected_closing" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expected Closing Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="probability" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Probability (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="no_of_employees" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Employees</FormLabel>
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
            {form.getValues().opportunity_from==='Customer' && form.getValues().party_name && (
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="industry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Industry (→ Industry Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Industry Type..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="website" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Website</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">City</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="state" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">State/Province</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opportunity Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="conversion_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="opportunity_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="base_opportunity_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Amount (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="utm_source" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Source (→ UTM Source)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UTM Source..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="utm_content" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Content</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="utm_campaign" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Campaign (→ UTM Campaign)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UTM Campaign..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="utm_medium" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Medium (→ UTM Medium)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UTM Medium..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">More Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transaction_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="language" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Language (→ Language)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Language..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Opportunity)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Opportunity..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="first_response_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">First Response Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lost Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().status===="Lost" && (
            <div className="col-span-2">
              <FormLabel className="">Lost Reasons</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Opportunity Lost Reason Detail — integrate with DataTable */}
                <p>Child table for Opportunity Lost Reason Detail</p>
              </div>
            </div>
            )}
            <FormField control={form.control} name="order_lost_reason" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Detailed Reason</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Competitors</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Competitor Detail — integrate with DataTable */}
                <p>Child table for Competitor Detail</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Primary Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {!!form.getValues().party_name && (
            <FormField control={form.control} name="contact_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Person (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="job_title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Job Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_mobile" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact Mobile</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">WhatsApp</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone_ext" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Phone Ext.</FormLabel>
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
          <CardTitle className="text-base">Address & Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
            {form.getValues().opportunity_from==='Customer' && form.getValues().party_name && (
            <FormField control={form.control} name="contact_display" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="items" className="space-y-4">
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Opportunity Item — integrate with DataTable */}
                <p>Child table for Opportunity Item</p>
              </div>
            </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="base_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total (Company Currency)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
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