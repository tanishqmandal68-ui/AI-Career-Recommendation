import { useNavigate } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "btn-primary text-white",
  secondary:
    "border border-slate-200 bg-white text-ink shadow-sm hover:border-brand-300",
  ghost: "text-muted hover:text-ink hover:bg-slate-100",
};

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

/** Button that navigates — works even when plain links fail. */
export function NavButton({
  to,
  children,
  variant = "primary",
  className = "",
}: NavButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
