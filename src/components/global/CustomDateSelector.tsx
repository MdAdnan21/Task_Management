import * as React from 'react';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

import { Label } from '../ui/label';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  required?: boolean;
  error?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, required, error, onChange, value, ...props }) => {
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    // Open the native date picker using the `showPicker()` method
    const handleDateClick = () => {
      if (dateInputRef.current) {
        dateInputRef.current.showPicker();
      }
    };

    return (
      <div className='w-full'>
        {label && (
          <Label className='mb-1 text-base font-bold'>
            {label}
            {required && <span className='text-destructive'>*</span>}
          </Label>
        )}
        <div className={cn('relative h-12 w-full mt-2', className)}>
          {/* Custom div to trigger the native date picker */}
          <div
            onClick={handleDateClick}
            className={cn(
              'flex h-full w-full cursor-pointer items-center justify-between rounded-[10px] bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2',
              error && 'bg-destructive/10',
              className
            )}
          >
            <span className='text-xs text-muted-foreground'>
              {value ? value : 'Select a date'}
            </span>
            <span className='icon'>📅</span>
          </div>

          {/* Hidden native date input that will be triggered */}
          <input
            type='date'
            ref={dateInputRef}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            {...props}
            onChange={(e) => {
              if (onChange) onChange(e);
            }}
          />
        </div>
        {error && <p className='mt-1 text-xs text-destructive'>{error}</p>}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput };
