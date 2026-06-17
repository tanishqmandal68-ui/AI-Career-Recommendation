import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "btn-primary text-white border-0 hover:opacity-95",
  secondary:
    "bg-white text-ink border border-slate-200 hover:border-brand-300 hover:shadow-md shadow-sm",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-slate-100",
  outline:
    "bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 hover:border-brand-300",
};

export function Button({
  variant = "primary",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
