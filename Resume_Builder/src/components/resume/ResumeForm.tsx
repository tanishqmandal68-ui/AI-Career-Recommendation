import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "../../context/ResumeEditorContext";
import {
  emptyEducation,
  emptyExperience,
  type Education,
  type Experience,
} from "../../types/resume";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-ink transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

const labelClass = "text-xs font-semibold text-muted";

type Step = "contact" | "summary" | "experience" | "education" | "skills";

interface ResumeFormProps {
  step: Step;
}

export function ResumeForm({ step }: ResumeFormProps) {
  const { data, setData, mode } = useResumeEditor();

  const updateExperience = (id: string, patch: Partial<Experience>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const updateEducation = (id: string, patch: Partial<Education>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill || data.skills.includes(skill)) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  };

  if (step === "contact") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-ink">Contact Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Full Name *</span>
            <input
              className={inputClass}
              value={data.fullName}
              onChange={(e) => setData((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="Jane Doe"
            />
          </label>
          <label className="block">
            <span className={labelClass}>
              {mode === "student" ? "Target Role / Major" : "Job Title"} *
            </span>
            <input
              className={inputClass}
              value={data.jobTitle}
              onChange={(e) => setData((p) => ({ ...p, jobTitle: e.target.value }))}
              placeholder={mode === "student" ? "Computer Science Student" : "Software Engineer"}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Email *</span>
            <input
              type="email"
              className={inputClass}
              value={data.email}
              onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
              placeholder="jane@email.com"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input
              className={inputClass}
              value={data.phone}
              onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+1 555 0100"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Location</span>
            <input
              className={inputClass}
              value={data.location}
              onChange={(e) => setData((p) => ({ ...p, location: e.target.value }))}
              placeholder="City, State"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>LinkedIn / Portfolio</span>
            <input
              className={inputClass}
              value={data.linkedin}
              onChange={(e) => setData((p) => ({ ...p, linkedin: e.target.value }))}
              placeholder="linkedin.com/in/janedoe"
            />
          </label>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-ink">
          {mode === "student" ? "Objective / Summary" : "Professional Summary"}
        </h3>
        <textarea
          className={`${inputClass} min-h-[160px] resize-y`}
          value={data.summary}
          onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
          placeholder={
            mode === "student"
              ? "Motivated student seeking internship opportunities..."
              : "Results-driven professional with 5+ years of experience..."
          }
        />
      </div>
    );
  }

  if (step === "experience") {
    const label = mode === "student" ? "Experience / Projects" : "Work Experience";
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">{label}</h3>
          <button
            type="button"
            onClick={() =>
              setData((p) => ({
                ...p,
                experiences: [...p.experiences, emptyExperience()],
              }))
            }
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        {data.experiences.map((exp, index) => (
          <div key={exp.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-muted">#{index + 1}</span>
              {data.experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      experiences: p.experiences.filter((e) => e.id !== exp.id),
                    }))
                  }
                  className="cursor-pointer rounded-lg p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>{mode === "student" ? "Role / Project" : "Job Title"}</span>
                <input
                  className={inputClass}
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClass}>{mode === "student" ? "Organization" : "Company"}</span>
                <input
                  className={inputClass}
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Start</span>
                <input
                  className={inputClass}
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  placeholder="Jan 2024"
                />
              </label>
              <label className="block">
                <span className={labelClass}>End</span>
                <input
                  className={inputClass}
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  placeholder="Present"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>Description</span>
                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (step === "education") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Education</h3>
          <button
            type="button"
            onClick={() =>
              setData((p) => ({
                ...p,
                education: [...p.education, emptyEducation()],
              }))
            }
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100"
          >
            <Plus className="h-4 w-4" />
            Add School
          </button>
        </div>
        {data.education.map((edu, index) => (
          <div key={edu.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-muted">School {index + 1}</span>
              {data.education.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      education: p.education.filter((e) => e.id !== edu.id),
                    }))
                  }
                  className="cursor-pointer rounded-lg p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={labelClass}>Degree / Program</span>
                <input
                  className={inputClass}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClass}>School</span>
                <input
                  className={inputClass}
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Year</span>
                <input
                  className={inputClass}
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-ink">Skills</h3>
      <div className="flex gap-2">
        <input
          id="skill-input"
          className={inputClass}
          placeholder="Type skill and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("skill-input") as HTMLInputElement;
            if (el) {
              addSkill(el.value);
              el.value = "";
            }
          }}
          className="shrink-0 cursor-pointer rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
          >
            {skill}
            <button
              type="button"
              onClick={() =>
                setData((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }))
              }
              className="cursor-pointer text-brand-400 hover:text-brand-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
