import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/layout/AuthLayout";
import { AuthFormField } from "../components/ui/AuthFormField";
import { errorClass, submitButtonClass, authLinkClass } from "../lib/formStyles";

export function SignupPage() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/resumes/new", { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = signup(name, email, password);
    if (result.ok) {
      navigate("/resumes/new", { replace: true });
    } else {
      setError(result.error ?? "Sign up failed");
    }
  };

  if (user) {
    return (
      <AuthLayout title="Create your account" subtitle="Redirecting…">
        <p className="text-center text-muted">Taking you to resume setup…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start building resumes for free">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className={errorClass}>{error}</p>}
        <AuthFormField
          label="Full Name"
          required
          value={name}
          onChange={setName}
          placeholder="Jane Doe"
        />
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
          minLength={6}
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
        />
        <button type="submit" className={submitButtonClass}>
          Sign up
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={authLinkClass}
        >
          Log in
        </button>
      </p>
    </AuthLayout>
  );
}
