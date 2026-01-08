import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const autoId = React.useId();
    const checkboxId = id ?? autoId;

    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          'peer h-5 w-5 shrink-0 rounded-md border-2 border-input shadow-sm transition-all duration-200',
          'hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (!label) return checkbox;

    return (
      <div className="flex items-start space-x-3">
        {checkbox}
        <div className="grid gap-1 leading-none">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
