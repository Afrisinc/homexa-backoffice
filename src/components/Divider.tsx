import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, label, orientation = "horizontal", ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("h-full w-px bg-border", className)}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={cn("relative flex items-center", className)}
          {...props}
        >
          <div className="flex-grow border-t border-border" />
          <span className="px-4 text-sm text-muted-foreground bg-transparent">
            {label}
          </span>
          <div className="flex-grow border-t border-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("w-full border-t border-border", className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };
