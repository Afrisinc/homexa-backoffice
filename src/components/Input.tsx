import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, success, hint, leftIcon, rightIcon, containerClassName, id, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const hasStatus = error || success;
    const statusIcon = error ? (
      <AlertCircle className="h-4 w-4 text-destructive" />
    ) : success ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : null;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="text-muted-foreground">{leftIcon}</span>
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            className={cn(
              'flex h-11 w-full rounded-lg border bg-card px-4 py-2 text-base text-foreground shadow-sm transition-all duration-200',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background focus:border-primary',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              leftIcon && 'pl-10',
              (rightIcon || isPassword || hasStatus) && 'pr-10',
              error && 'border-destructive focus:ring-destructive',
              success && 'border-success focus:ring-success',
              !error && !success && 'border-input hover:border-primary/50',
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 gap-1">
            {hasStatus && statusIcon}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            {rightIcon && !isPassword && !hasStatus && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}
          </div>
        </div>
        {(error || success || hint) && (
          <p
            className={cn(
              'text-sm',
              error && 'text-destructive',
              success && 'text-success',
              hint && !error && !success && 'text-muted-foreground'
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
