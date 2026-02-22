'use client';

import { Input } from 'afenda-ui/components/input';
import { Label } from 'afenda-ui/components/label';

/**
 * FormConfigRenderer — Renders form fields from form.config.
 * Config-driven forms; no per-entity form components needed.
 */

type FormFieldConfig = {
  type: 'boolean' | 'string' | 'int' | 'enum' | 'date' | 'timestamptz' | 'json';
  label: string;
  required?: boolean;
  choices?: readonly string[];
};

type FormConfig = {
  entityType: string;
  order: readonly string[];
  fields: Record<string, FormFieldConfig>;
};

interface FormConfigRendererProps {
  config: FormConfig;
  defaultValues?: Record<string, string | boolean | number | null>;
  /** Field name prefix for form (e.g. for grouped forms) */
  namePrefix?: string;
}

function toCamel(s: string): string {
  return s
    .split(/[-_]/)
    .map((p, i) =>
      i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(),
    )
    .join('');
}

export function FormConfigRenderer({
  config,
  defaultValues = {},
  namePrefix = '',
}: FormConfigRendererProps) {
  const name = (key: string) => (namePrefix ? `${namePrefix}.${key}` : key);

  return (
    <div className="space-y-4">
      {config.order.map((fieldKey) => {
        const field = config.fields[fieldKey];
        if (!field) return null;

        const inputName = name(fieldKey);
        const camelKey = toCamel(fieldKey);
        const defaultValue = defaultValues[fieldKey] ?? defaultValues[camelKey] ?? '';

        if (field.type === 'boolean') {
          const checked =
            typeof defaultValue === 'boolean'
              ? defaultValue
              : String(defaultValue) === 'true';
          return (
            <div key={fieldKey} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={inputName}
                name={inputName}
                value="true"
                defaultChecked={checked}
                className="border-input size-4 rounded border"
              />
              <Label htmlFor={inputName} className="font-normal cursor-pointer">
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
            </div>
          );
        }

        if (field.type === 'enum' && field.choices?.length) {
          return (
            <div key={fieldKey} className="space-y-2">
              <Label htmlFor={inputName}>
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              <select
                id={inputName}
                name={inputName}
                defaultValue={String(defaultValue)}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select {field.label}</option>
                {field.choices.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // string, int, date, timestamptz, json
        const inputType =
          field.type === 'int'
            ? 'number'
            : field.type === 'date' || field.type === 'timestamptz'
              ? 'datetime-local'
              : 'text';

        return (
          <div key={fieldKey} className="space-y-2">
            <Label htmlFor={inputName}>
              {field.label}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            <Input
              id={inputName}
              name={inputName}
              type={inputType}
              defaultValue={String(defaultValue ?? '')}
              placeholder={field.label}
              required={field.required}
            />
          </div>
        );
      })}
    </div>
  );
}
