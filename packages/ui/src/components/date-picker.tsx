'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/button';
import { Calendar } from '@/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { cn } from '@/lib/utils';

/**
 * Single date picker — Popover + Calendar + Button composition.
 *
 * @example
 * ```tsx
 * const [date, setDate] = React.useState<Date>();
 * <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
 * ```
 */
function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  dateFormat = 'PPP',
  disabled,
  className,
  calendarProps,
  ...props
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  dateFormat?: string;
  disabled?: boolean;
  className?: string;
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect'
  >;
} & Omit<React.ComponentProps<typeof Popover>, 'children'>) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker-trigger"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          data-slot="date-picker-calendar"
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Date range picker — Popover + Calendar (range mode) + Button composition.
 *
 * @example
 * ```tsx
 * const [range, setRange] = React.useState<DateRange>();
 * <DateRangePicker value={range} onChange={setRange} />
 * ```
 */
function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  dateFormat = 'LLL dd, y',
  disabled,
  className,
  numberOfMonths = 2,
  calendarProps,
  ...props
}: {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  dateFormat?: string;
  disabled?: boolean;
  className?: string;
  numberOfMonths?: number;
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect' | 'numberOfMonths'
  >;
} & Omit<React.ComponentProps<typeof Popover>, 'children'>) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-range-picker-trigger"
          id="date"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, dateFormat)} –{' '}
                {format(value.to, dateFormat)}
              </>
            ) : (
              format(value.from, dateFormat)
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          data-slot="date-range-picker-calendar"
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, DateRangePicker };
