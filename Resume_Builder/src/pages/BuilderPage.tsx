import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { ResumeEditorProvider, useResumeEditor } from "../context/ResumeEditorContext";
import { ResumeForm } from "../components/resume/ResumeForm";
import { ResumePreview } from "../components/resume/ResumePreview";
import { exportResumeDataToPdf } from "../lib/exportPdf";
import { getResumeById } from "../lib/resumeStorage";

const STEPS = [
  { id: "contact" as const, label: "Contact" },
  { id: "summary" as const, label: "Summary" },
  { id: "experience" as const, label: "Experience" },
  { id: "education" as const, label: "Education" },
  { id: "skills" as const, label: "Skills" },
];

function BuilderContent() {
  const navigate = useNavigate();
  const { saved, data, mode, completionPercent, persist } = useResumeEditor();
  const [stepIndex, setStepIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleExport = async () => {
    if (!data.fullName.trim() || !data.email.trim()) {
      setExportError("Please fill in your name and email in the Contact step.");
      setStepIndex(0);
      return;
    }
    setExportError(null);
    setExporting(true);
    persist();
    try {
      const safe = (saved.title || data.fullName)
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase() || "resume";
      exportResumeDataToPdf(data, mode, `${safe}.pdf`);
    } catch {
      setExportError("Could not export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/resumes")}
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-muted hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Resumes
          </button>
          <h1 className="mt-2 text-2xl font-bold text-ink">{saved.title}</h1>
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase ${
              mode === "student"
                ? "bg-blue-50 text-blue-600"
                : "bg-brand-50 text-brand-600"
            }`}
          >
            {mode === "student" ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <Briefcase className="h-3.5 w-3.5" />
            )}
            {mode} mode
          </span>
        </div>
        <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-600">
          {completionPercent}% complete
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-shadow rounded-2xl border border-slate-100 bg-white p-6">
          <div className="mb-6 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIndex(i)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  i === stepIndex
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-muted hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <ResumeForm step={step.id} />

          {exportError && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{exportError}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => i - 1)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex gap-2">
              {isLast ? (
                <button
                  type="button"
                  disabled={exporting}
                  onClick={handleExport}
                  className="btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {exporting ? "Generating…" : "Download PDF"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => i + 1)}
                  className="btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Live Preview</h3>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="cursor-pointer text-xs font-semibold text-brand-600 hover:underline disabled:opacity-50"
            >
              Export PDF
            </button>
          </div>
          <div className="card-shadow max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-100">
            <ResumePreview />
          </div>
        </div>
      </div>
    </main>
  );
}

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const resume = id ? getResumeById(id) : undefined;

  if (!id || !resume) {
    return (
      <main className="px-6 py-20 text-center">
        <p className="text-muted">Resume not found.</p>
        <Link to="/resumes" className="mt-4 inline-block font-semibold text-brand-600">
          Go to My Resumes
        </Link>
      </main>
    );
  }

  if (resume.userId !== user?.id) {
    return <Navigate to="/resumes" replace />;
  }

  return (
    <ResumeEditorProvider resumeId={id}>
      <BuilderContent />
    </ResumeEditorProvider>
  );
}
