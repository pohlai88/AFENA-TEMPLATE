"use client";

// Form for Task
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "../types/task.js";
import { TaskInsertSchema } from "../types/task.js";

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

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaskForm({ initialData = {}, onSubmit, mode, isLoading }: TaskFormProps) {
  const form = useForm<Partial<Task>>({
    resolver: zodResolver(TaskInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.subject as string) ?? "Task" : "New Task"}
          </h2>
        </div>
            <FormField control={form.control} name="subject" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subject</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="project" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Project (→ Project)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Project..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="issue" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Issue (→ Issue)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Issue..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Type (→ Task Type)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Task Type..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="color" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Color</FormLabel>
                <FormControl>
                  <Input type="color" className="h-10 w-20" {...f} value={(f.value as string) ?? "#000000"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_group" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-semibold">Is Group</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_template" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Template</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Working">Working</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Template">Template</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="priority" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Priority</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="task_weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Weight</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="parent_task" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Parent Task (→ Task)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Task..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().status === "Completed" && (
            <FormField control={form.control} name="completed_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Completed By (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().status === "Completed" && (
            <FormField control={form.control} name="completed_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Completed On</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="exp_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Expected Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expected_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expected Time (in hours)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_template && (
            <FormField control={form.control} name="start" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Begin On (Days)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="exp_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Expected End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="progress" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">% Progress</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().is_template && (
            <FormField control={form.control} name="duration" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Duration (Days)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="is_milestone" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Milestone</FormLabel>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Task Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Dependent Tasks</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Task Depends On — integrate with DataTable */}
                <p>Child table for Task Depends On</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="act_start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual Start Date (via Timesheet)</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="actual_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual Time in Hours (via Timesheet)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="act_end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Actual End Date (via Timesheet)</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="total_costing_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Costing Amount (via Timesheet)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_billing_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Billable Amount (via Timesheet)</FormLabel>
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
          <CardTitle className="text-base">More Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {form.getValues().status === "Closed" || form.getValues().status === "Pending Review" && (
            <FormField control={form.control} name="review_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Review Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().status === "Closed" && (
            <FormField control={form.control} name="closing_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Closing Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="department" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Department (→ Department)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Department..." {...f} value={(f.value as string) ?? ""} />
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