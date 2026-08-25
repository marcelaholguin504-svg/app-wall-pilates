import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-display font-bold transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-glow",
        accent: "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-glow",
        destructive: "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground shadow-glow",
        secondary: "bg-card text-foreground border border-border",
        ghost: "bg-transparent text-primary hover:bg-muted",
        success: "bg-gradient-to-br from-success to-success/80 text-success-foreground",
        link: "bg-transparent underline-offset-4 hover:underline text-primary p-0 h-auto",
      },
      size: {
        default: "h-12 px-5 py-3 text-base w-full",
        lg: "h-14 px-6 py-4 text-lg w-full",
        sm: "h-10 px-4 py-2 text-sm w-full",
        icon: "h-11 w-11 shrink-0",
        auto: "h-auto px-4 py-2 text-sm w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
