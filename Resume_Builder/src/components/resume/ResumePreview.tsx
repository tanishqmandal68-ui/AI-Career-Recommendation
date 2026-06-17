import { useResumeEditor } from "../../context/ResumeEditorContext";

export function ResumePreview() {
  const { data, mode } = useResumeEditor();

  const contact = [data.email, data.phone, data.location, data.linkedin]
    .filter(Boolean)
    .join(" · ");

  const isStudent = mode === "student";
  const accent = isStudent ? "#2563eb" : "#5346e5";
  const font = isStudent
    ? "'Inter', system-ui, sans-serif"
    : "Georgia, 'Times New Roman', serif";

  const SectionTitle = ({ children }: { children: string }) => (
    <h2
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4 }}
    >
      {children}
    </h2>
  );

  const educationBlock = data.education.some((e) => e.school || e.degree) && (
    <section className="mt-5">
      <SectionTitle>Education</SectionTitle>
      <ul className="mt-3 space-y-2">
        {data.education
          .filter((e) => e.school || e.degree)
          .map((edu) => (
            <li key={edu.id} className="text-sm">
              <span className="font-semibold text-slate-900">{edu.degree || "Degree"}</span>
              {edu.school && <span className="text-slate-600"> — {edu.school}</span>}
              {edu.year && <span className="text-slate-500"> ({edu.year})</span>}
            </li>
          ))}
      </ul>
    </section>
  );

  const experienceBlock = data.experiences.some((e) => e.company || e.role) && (
    <section className="mt-5">
      <SectionTitle>{isStudent ? "Experience & Projects" : "Experience"}</SectionTitle>
      <ul className="mt-3 space-y-4">
        {data.experiences
          .filter((e) => e.company || e.role)
          .map((exp) => (
            <li key={exp.id}>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900">{exp.role || "Role"}</span>
                  {exp.company && <span className="text-slate-600"> — {exp.company}</span>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <span className="text-xs text-slate-500">
                    {exp.startDate}
                    {exp.startDate && exp.endDate ? " – " : ""}
                    {exp.endDate || "Present"}
                  </span>
                )}
              </div>
              {exp.description && (
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {exp.description}
                </p>
              )}
            </li>
          ))}
      </ul>
    </section>
  );

  return (
    <div
      id="resume-preview"
      className="mx-auto w-full max-w-[210mm] bg-white p-8 text-slate-800"
      style={{ fontFamily: font }}
    >
      <header className="pb-4" style={{ borderBottom: `3px solid ${accent}` }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {data.fullName || "Your Name"}
        </h1>
        {data.jobTitle && (
          <p className="mt-1 text-lg" style={{ color: accent }}>
            {data.jobTitle}
          </p>
        )}
        {contact && <p className="mt-2 text-sm text-slate-500">{contact}</p>}
        {isStudent && (
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
            Student Resume
          </p>
        )}
      </header>

      {data.summary && (
        <section className="mt-5">
          <SectionTitle>{isStudent ? "Objective" : "Summary"}</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{data.summary}</p>
        </section>
      )}

      {isStudent ? (
        <>
          {educationBlock}
          {experienceBlock}
        </>
      ) : (
        <>
          {experienceBlock}
          {educationBlock}
        </>
      )}

      {data.skills.length > 0 && (
        <section className="mt-5">
          <SectionTitle>Skills</SectionTitle>
          <p className="mt-2 text-sm text-slate-700">{data.skills.join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
