import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-orange-600 text-white shadow-sm hover:bg-orange-700 active:bg-orange-800 border border-orange-600/50',
        coral:
          'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 border border-rose-600/50',
        mint:
          'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 border border-emerald-600/50',
        blue:
          'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 border border-indigo-600/50',
        purple:
          'bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:bg-violet-800 border border-violet-600/50',
        outline:
          'bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/60',
        ghost:
          'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-100',
        link:
          'text-orange-600 underline-offset-4 hover:underline p-0 h-auto font-medium',
      },
      size: {
        default: 'h-10 px-5 py-2.5 text-sm font-medium',
        sm: 'h-8 rounded-lg px-3 py-1.5 text-xs font-medium',
        lg: 'h-12 rounded-xl px-6 py-3 text-base font-semibold',
        icon: 'h-9 w-9 rounded-lg p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
