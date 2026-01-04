import * as React from 'react';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeConfig = {
  sm: { icon: 'h-6 w-6', text: 'text-lg', container: 'gap-2' },
  md: { icon: 'h-8 w-8', text: 'text-xl', container: 'gap-2.5' },
  lg: { icon: 'h-10 w-10', text: 'text-2xl', container: 'gap-3' },
};

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = 'md', showText = true, ...props }, ref) => {
    const config = sizeConfig[size];

    return (
      <div ref={ref} className={cn('flex items-center', config.container, className)} {...props}>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-deep p-2 shadow-md">
            <Leaf className={cn(config.icon, 'text-primary-foreground')} />
          </div>
        </div>
        {showText && (
          <span
            className={cn('font-serif font-semibold tracking-tight text-foreground', config.text)}
          >
            Afrisinc
          </span>
        )}
      </div>
    );
  }
);

Logo.displayName = 'Logo';

export { Logo };
