import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, GraduationCap, Plus, Trash2, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { calcCompletion, deleteResume, getResumesForUser } from "../lib/resumeStorage";

export function ResumesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const resumes = useMemo(
    () => (user ? getResumesForUser(user.id) : []),
    [user, tick],
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        deleteResume(id);
        setTick((t) => t + 1);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete resume.";
        alert(msg);
      }
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Resumes</h1>
          <p className="mt-2 text-muted">Create, edit, and export your resumes as PDF</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/resumes/new")}
          className="btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Create Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="card-shadow mt-12 rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-brand-300" />
          <h2 className="mt-4 text-xl font-bold text-ink">No resumes yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Create your first resume — choose Student or Professional mode and start building.
          </p>
          <button
            type="button"
            onClick={() => navigate("/resumes/new")}
            className="btn-primary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Create your first resume
          </button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {resumes.map((r) => (
            <li
              key={r.id}
              className="card-shadow group rounded-2xl border border-slate-100 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      r.mode === "student"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-brand-100 text-brand-600"
                    }`}
                  >
                    {r.mode === "student" ? (
                      <GraduationCap className="h-5 w-5" />
                    ) : (
                      <Briefcase className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{r.title}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        r.mode === "student"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-brand-50 text-brand-600"
                      }`}
                    >
                      {r.mode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id, r.title)}
                  className="cursor-pointer rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  aria-label="Delete resume"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-muted">
                  <span>Completion</span>
                  <span className="text-brand-600">{calcCompletion(r.data)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${calcCompletion(r.data)}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">
                Updated {new Date(r.updatedAt).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => navigate(`/resumes/${r.id}/edit`)}
                className="mt-4 inline-flex w-full cursor-pointer justify-center rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100"
              >
                Edit Resume
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
