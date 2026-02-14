"use client";

// Form for Supplier
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Supplier } from "../types/supplier.js";
import { SupplierInsertSchema } from "../types/supplier.js";

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

interface SupplierFormProps {
  initialData?: Partial<Supplier>;
  onSubmit: (data: Partial<Supplier>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierFormProps) {
  const form = useForm<Partial<Supplier>>({
    resolver: zodResolver(SupplierInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.supplier_name as string) ?? "Supplier" : "New Supplier"}
          </h2>
        </div>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="address-&-contact">Address & Contact</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="portal-users">Portal Users</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
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
            <FormField control={form.control} name="supplier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Supplier Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().supplier_type === 'Individual' && (
            <FormField control={form.control} name="gender" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Gender (→ Gender)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Gender..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="supplier_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Group (→ Supplier Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Group..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="is_transporter" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Transporter</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billing Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_bank_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Company Bank Account (→ Bank Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Bank Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Internal Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="is_internal_supplier" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Internal Supplier</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().is_internal_supplier && (
            <FormField control={form.control} name="represents_company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Represents Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().represents_company && (
            <div className="col-span-2">
              <FormLabel className="">Allowed To Transact With</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Allowed To Transact With — integrate with DataTable */}
                <p>Child table for Allowed To Transact With</p>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">More Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="supplier_details" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Supplier Details</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Statutory info and other general information about your Supplier</FormDescription>
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
            <FormField control={form.control} name="language" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Print Language (→ Language)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Language..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Customer Numbers</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Customer Number At Supplier — integrate with DataTable */}
                <p>Child table for Customer Number At Supplier</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="tax" className="space-y-4">
            <FormField control={form.control} name="tax_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Category (→ Tax Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_withholding_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Group (→ Tax Withholding Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="address-&-contact" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address and Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="address_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Primary Address and Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="supplier_primary_address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Primary Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Reselect, if the chosen address is edited after save</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="primary_address" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Primary Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier_primary_contact" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Primary Contact (→ Contact)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Contact..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Reselect, if the chosen contact is edited after save</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mobile_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mobile No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email Id</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="accounting" className="space-y-4">
            <FormField control={form.control} name="payment_terms" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Payment Terms Template (→ Payment Terms Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Terms Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Accounts</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Party Account — integrate with DataTable */}
                <p>Child table for Party Account</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <FormField control={form.control} name="allow_purchase_invoice_creation_without_purchase_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Purchase Invoice Creation Without Purchase Order</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="allow_purchase_invoice_creation_without_purchase_receipt" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow Purchase Invoice Creation Without Purchase Receipt</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-semibold">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_frozen" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Frozen</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Block Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="on_hold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Block Supplier</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().on_hold && (
            <FormField control={form.control} name="hold_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Hold Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Invoices">Invoices</SelectItem>
                    <SelectItem value="Payments">Payments</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().on_hold && (
            <FormField control={form.control} name="release_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Leave blank if the Supplier is blocked indefinitely</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="portal-users" className="space-y-4">
            <div className="col-span-2">
              <FormLabel className="">Supplier Portal Users</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Portal User — integrate with DataTable */}
                <p>Child table for Portal User</p>
              </div>
            </div>
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