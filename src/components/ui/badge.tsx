import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-orange-100 text-orange-800 border border-orange-200/80',
        coral: 'bg-rose-100 text-rose-800 border border-rose-200/80',
        destructive: 'bg-red-100 text-red-800 border border-red-200/80',
        mint: 'bg-emerald-100 text-emerald-800 border border-emerald-200/80',
        teal: 'bg-teal-100 text-teal-800 border border-teal-200/80',
        blue: 'bg-blue-100 text-blue-800 border border-blue-200/80',
        purple: 'bg-purple-100 text-purple-800 border border-purple-200/80',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
        outline: 'bg-white text-slate-700 border border-slate-200 shadow-2xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
