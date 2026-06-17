import { ArrowRight, CheckCircle2, FileText, GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { NavButton } from "../components/ui/NavButton";

const steps = [
  {
    n: 1,
    title: "Sign up free",
    desc: "Create your account in seconds — no credit card required.",
  },
  {
    n: 2,
    title: "Choose Student or Pro",
    desc: "Pick the layout that fits your career stage and name your resume.",
  },
  {
    n: 3,
    title: "Export PDF",
    desc: "Fill in your details, preview live, and download a ready-to-send PDF.",
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-brand-700">Career Navigator</span>
          <nav className="flex items-center gap-3 sm:gap-4">
            <NavButton to="/login" variant="ghost" className="!rounded-full !px-4 !py-2">
              Log in
            </NavButton>
            <NavButton to="/signup" variant="primary" className="!rounded-full !px-5 !py-2.5">
              Get Started
            </NavButton>
          </nav>
        </div>
      </header>

      <section className="gradient-hero px-6 pb-20 pt-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-brand-600">
            <Sparkles className="h-3.5 w-3.5" />
            AI Resume Builder
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl">
            Build a stunning resume in{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              minutes
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Student or professional — enter your details, preview instantly, and export
            a polished PDF resume ready for employers.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NavButton
              to="/signup"
              variant="primary"
              className="!rounded-full !px-8 !py-3.5"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </NavButton>
            <NavButton to="/login" variant="secondary" className="!rounded-full !px-8 !py-3.5">
              Log in
            </NavButton>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="card-shadow rounded-2xl border-2 border-blue-200 bg-white p-6 text-left">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h3 className="mt-4 text-lg font-bold">Student</h3>
            <p className="mt-2 text-sm text-muted">
              Education-first layout for internships, campus roles, and first jobs.
            </p>
          </div>
          <div className="card-shadow rounded-2xl border-2 border-brand-200 bg-white p-6 text-left">
            <Briefcase className="h-10 w-10 text-brand-600" />
            <h3 className="mt-4 text-lg font-bold">Professional</h3>
            <p className="mt-2 text-sm text-muted">
              Experience-focused layout for mid-level and senior careers.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-ink">How it works</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
                {s.n}
              </div>
              <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="card-shadow mx-auto flex max-w-3xl flex-col items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-10 text-center text-white sm:p-14">
          <FileText className="h-12 w-12 opacity-90" />
          <h2 className="mt-4 text-2xl font-bold">Ready to build your resume?</h2>
          <p className="mt-3 max-w-md text-brand-100">
            Join Career Navigator — create unlimited resumes and download PDFs anytime.
          </p>
          <NavButton
            to="/signup"
            variant="secondary"
            className="mt-8 !rounded-full !bg-white !text-brand-700 !shadow-lg hover:!bg-brand-50"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </NavButton>
          <ul className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-brand-100">
            {["Free to use", "Student & Pro modes", "PDF export"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-muted">
        <p className="font-semibold text-brand-700">Career Navigator</p>
        <p className="mt-1">© 2026 · AI Resume Builder</p>
      </footer>
    </div>
  );
}
