import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/layout/AuthLayout";
import { AuthFormField } from "../components/ui/AuthFormField";
import { errorClass, submitButtonClass, authLinkClass } from "../lib/formStyles";

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
        {error && <p className={errorClass}>{error}</p>}
        <AuthFormField
          label="Email"
          type="email"
          required
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
        />
        <AuthFormField
          label="Password"
          type="password"
          required
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />
        <button type="submit" className={submitButtonClass}>
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className={authLinkClass}
        >
          Sign up
        </button>
      </p>
    </AuthLayout>
  );
}
