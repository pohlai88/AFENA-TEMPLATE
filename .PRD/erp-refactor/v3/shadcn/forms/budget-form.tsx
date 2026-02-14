"use client";

// Form for Budget
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Budget } from "../types/budget.js";
import { BudgetInsertSchema } from "../types/budget.js";

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

interface BudgetFormProps {
  initialData?: Partial<Budget>;
  onSubmit: (data: Partial<Budget>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BudgetForm({ initialData = {}, onSubmit, mode, isLoading }: BudgetFormProps) {
  const form = useForm<Partial<Budget>>({
    resolver: zodResolver(BudgetInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Budget" : "New Budget"}
        </h2>
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
            <FormField control={form.control} name="budget_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Budget Against</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cost Center">Cost Center</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
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
            {form.getValues().budget_against === 'Cost Center' && (
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().budget_against === 'Project' && (
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Budget)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Budget..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="distribution_frequency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Distribution Frequency</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="budget_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Budget Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="distribute_equally" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Distribute Equally</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Budget Distribution</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Budget Distribution — integrate with DataTable */}
                <p>Child table for Budget Distribution</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="budget_distribution_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Budget Distribution Total</FormLabel>
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
          <CardTitle className="text-base">Control Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="applicable_on_material_request" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Applicable on Material Request</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().applicable_on_material_request === 1 && (
            <FormField control={form.control} name="action_if_annual_budget_exceeded_on_mr" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Annual Budget Exceeded on MR</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_on_material_request === 1 && (
            <FormField control={form.control} name="action_if_accumulated_monthly_budget_exceeded_on_mr" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Accumulated Monthly Budget Exceeded on MR</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="applicable_on_purchase_order" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Applicable on Purchase Order</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().applicable_on_purchase_order === 1 && (
            <FormField control={form.control} name="action_if_annual_budget_exceeded_on_po" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Annual Budget Exceeded on PO</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_on_purchase_order === 1 && (
            <FormField control={form.control} name="action_if_accumulated_monthly_budget_exceeded_on_po" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Accumulated Monthly Budget Exceeded on PO</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="applicable_on_booking_actual_expenses" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Applicable on booking actual expenses</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.getValues().applicable_on_booking_actual_expenses === 1 && (
            <FormField control={form.control} name="action_if_annual_budget_exceeded" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Annual Budget Exceeded on Actual</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_on_booking_actual_expenses === 1 && (
            <FormField control={form.control} name="action_if_accumulated_monthly_budget_exceeded" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Accumulated Monthly Budget Exceeded on Actual</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control Action for Cumulative Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="applicable_on_cumulative_expense" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Applicable on Cumulative Expense</FormLabel>
                  <FormDescription>(Purchase Order + Material Request + Actual Expense)</FormDescription>
                </div>
              </FormItem>
            )} />
            {form.getValues().applicable_on_cumulative_expense === 1 && (
            <FormField control={form.control} name="action_if_annual_exceeded_on_cumulative_expense" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Anual Budget Exceeded on Cumulative Expense</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().applicable_on_cumulative_expense === 1 && (
            <FormField control={form.control} name="action_if_accumulated_monthly_exceeded_on_cumulative_expense" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Action if Accumulative Monthly Budget Exceeded on Cumulative Expense</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stop">Stop</SelectItem>
                    <SelectItem value="Warn">Warn</SelectItem>
                    <SelectItem value="Ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="revision_of" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Revision Of</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}