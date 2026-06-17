import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { saveResume } from "../lib/resumeStorage";
import { defaultResumeData, type ResumeMode } from "../types/resume";

export function CreateResumePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<ResumeMode>("student");
  const [error, setError] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }
    if (!user) return;

    const id = crypto.randomUUID();
    const data = defaultResumeData();
    data.fullName = user.name;
    data.email = user.email;

    saveResume({
      id,
      userId: user.id,
      title: title.trim(),
      mode,
      data,
      updatedAt: new Date().toISOString(),
    });

    navigate(`/resumes/${id}/edit`);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold text-ink">Create a new resume</h1>
      <p className="mt-2 text-muted">Give it a name and choose your profile type</p>

      <form onSubmit={handleCreate} className="card-shadow mt-8 space-y-8 rounded-2xl border border-slate-100 bg-white p-8">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <label className="block">
          <span className="text-sm font-semibold text-ink">Resume Title *</span>
          <p className="mt-1 text-xs text-muted">
            e.g. &quot;Software Intern Summer 2026&quot; or &quot;Product Manager CV&quot;
          </p>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="My Resume"
          />
        </label>

        <div>
          <span className="text-sm font-semibold text-ink">Profile Type *</span>
          <p className="mt-1 text-xs text-muted">
            This adjusts the layout and sections for your experience level
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("student")}
              className={`cursor-pointer rounded-2xl border-2 p-6 text-left transition ${
                mode === "student"
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                  : "border-slate-200 hover:border-blue-200"
              }`}
            >
              <GraduationCap
                className={`h-8 w-8 ${mode === "student" ? "text-blue-600" : "text-slate-400"}`}
              />
              <h3 className="mt-3 font-bold text-ink">Student</h3>
              <p className="mt-1 text-xs text-muted">
                Education-first layout for internships, campus roles, and entry-level jobs
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("professional")}
              className={`cursor-pointer rounded-2xl border-2 p-6 text-left transition ${
                mode === "professional"
                  ? "border-brand-500 bg-brand-50 shadow-md shadow-brand-500/10"
                  : "border-slate-200 hover:border-brand-200"
              }`}
            >
              <Briefcase
                className={`h-8 w-8 ${mode === "professional" ? "text-brand-600" : "text-slate-400"}`}
              />
              <h3 className="mt-3 font-bold text-ink">Professional</h3>
              <p className="mt-1 text-xs text-muted">
                Experience-focused layout for mid-level and senior careers
              </p>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white"
        >
          Continue to Resume Builder
        </button>
      </form>
    </main>
  );
}
