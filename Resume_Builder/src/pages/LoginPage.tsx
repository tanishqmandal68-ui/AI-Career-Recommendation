import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/layout/AuthLayout";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/resumes";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  if (user) {
    return (
      <AuthLayout title="Welcome back" subtitle="Redirecting…">
        <p className="text-center text-muted">Taking you to your resumes…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your resumes">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        <label className="block">
          <span className="text-xs font-semibold text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          className="btn-primary w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white"
        >
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="cursor-pointer font-semibold text-brand-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </AuthLayout>
  );
}
