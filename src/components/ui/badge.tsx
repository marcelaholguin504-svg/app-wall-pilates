import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold", {
  variants: {
    variant: {
      default: "bg-primary/20 text-primary border-primary/40",
      accent: "bg-accent/20 text-accent border-accent/40",
      success: "bg-success/20 text-success border-success/40",
      destructive: "bg-destructive/20 text-destructive border-destructive/40",
      outline: "bg-transparent text-muted-foreground border-border",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
