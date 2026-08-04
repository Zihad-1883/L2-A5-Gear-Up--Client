import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700",
        outline:
          "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        // GearUp Status Pill Variants
        pending:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        approved:
          "border-sky-500/30 bg-sky-500/10 text-sky-400",
        paid:
          "border-purple-500/30 bg-purple-500/10 text-purple-300",
        active:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        returned:
          "border-slate-600/30 bg-slate-700/20 text-slate-300",
        danger:
          "border-rose-500/30 bg-rose-500/10 text-rose-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

function Badge({ className, variant, showDot = true, children, ...props }: BadgeProps) {
  const dotColorClass = React.useMemo(() => {
    switch (variant) {
      case "pending":
        return "bg-amber-400 animate-pulse";
      case "approved":
        return "bg-sky-400";
      case "paid":
        return "bg-purple-400";
      case "active":
        return "bg-emerald-400";
      case "returned":
        return "bg-slate-400";
      case "danger":
      case "destructive":
        return "bg-rose-400";
      default:
        return "bg-teal-400";
    }
  }, [variant]);

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColorClass)} />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
