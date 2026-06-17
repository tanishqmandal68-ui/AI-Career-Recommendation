interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="gradient-hero hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <a href="#/" className="cursor-pointer text-2xl font-bold text-brand-700">
          Career Navigator
        </a>
        <div>
          <h2 className="text-3xl font-bold leading-tight text-ink">
            Build resumes that get you hired
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Student or professional — pick your path, fill in your details, and
            download a polished PDF in minutes.
          </p>
        </div>
        <p className="text-sm text-muted">© 2026 Career Navigator</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <a href="#/" className="mb-8 cursor-pointer text-xl font-bold text-brand-700 lg:hidden">
          Career Navigator
        </a>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
