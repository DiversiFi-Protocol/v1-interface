import * as React from 'react';

import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/tw';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps extends Omit<React.ComponentProps<'select'>, 'children'> {
  options: readonly (SelectOption | string)[];
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, options, ...props }, ref) => {
    return (
      <div className={cn('relative inline-flex', containerClassName)}>
        <select
          ref={ref}
          className={cn(
            'h-9 w-full appearance-none rounded-full border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
      </div>
    );
  }
);
Select.displayName = 'Select';

type IconSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

interface IconSelectProps {
  options: readonly IconSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

function IconSelect({
  options,
  value,
  onChange,
  className,
  containerClassName,
  placeholder,
  disabled,
}: IconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn('relative inline-flex', containerClassName)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              'row items-center gap-2 h-9 w-full rounded-full border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          >
            {selected?.icon}
            <span className="truncate">{selected?.label ?? placeholder ?? ''}</span>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'row items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm text-left hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent/50'
                    )}
                  >
                    {opt.icon}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 opacity-60" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { Select, IconSelect };
export type { SelectOption, IconSelectOption };
