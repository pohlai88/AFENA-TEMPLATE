"use client";

// Form for Video Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VideoSettings } from "../types/video-settings.js";
import { VideoSettingsInsertSchema } from "../types/video-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface VideoSettingsFormProps {
  initialData?: Partial<VideoSettings>;
  onSubmit: (data: Partial<VideoSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function VideoSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: VideoSettingsFormProps) {
  const form = useForm<Partial<VideoSettings>>({
    resolver: zodResolver(VideoSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Video Settings" : "New Video Settings"}
        </h2>
            <FormField control={form.control} name="enable_youtube_tracking" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable YouTube Tracking</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().enable_youtube_tracking && (
            <FormField control={form.control} name="api_key" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">API Key</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().enable_youtube_tracking && (
            <FormField control={form.control} name="frequency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Frequency</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30 mins">30 mins</SelectItem>
                    <SelectItem value="1 hr">1 hr</SelectItem>
                    <SelectItem value="6 hrs">6 hrs</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}