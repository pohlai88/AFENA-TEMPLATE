"use client";

// Form for Item Barcode
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemBarcode } from "../types/item-barcode.js";
import { ItemBarcodeInsertSchema } from "../types/item-barcode.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ItemBarcodeFormProps {
  initialData?: Partial<ItemBarcode>;
  onSubmit: (data: Partial<ItemBarcode>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemBarcodeForm({ initialData = {}, onSubmit, mode, isLoading }: ItemBarcodeFormProps) {
  const form = useForm<Partial<ItemBarcode>>({
    resolver: zodResolver(ItemBarcodeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Barcode" : "New Item Barcode"}
        </h2>
            <FormField control={form.control} name="barcode" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Barcode</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="barcode_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Barcode Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EAN">EAN</SelectItem>
                    <SelectItem value="UPC-A">UPC-A</SelectItem>
                    <SelectItem value="CODE-39">CODE-39</SelectItem>
                    <SelectItem value="EAN-13">EAN-13</SelectItem>
                    <SelectItem value="EAN-8">EAN-8</SelectItem>
                    <SelectItem value="GS1">GS1</SelectItem>
                    <SelectItem value="GTIN">GTIN</SelectItem>
                    <SelectItem value="GTIN-14">GTIN-14</SelectItem>
                    <SelectItem value="ISBN">ISBN</SelectItem>
                    <SelectItem value="ISBN-10">ISBN-10</SelectItem>
                    <SelectItem value="ISBN-13">ISBN-13</SelectItem>
                    <SelectItem value="ISSN">ISSN</SelectItem>
                    <SelectItem value="JAN">JAN</SelectItem>
                    <SelectItem value="PZN">PZN</SelectItem>
                    <SelectItem value="UPC">UPC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}