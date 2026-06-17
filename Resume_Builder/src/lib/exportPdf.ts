import { jsPDF } from "jspdf";
import type { ResumeData, ResumeMode } from "../types/resume";

const MARGIN = 18;
const PAGE_BOTTOM = 285;
const LINE = 5.2;

/** Build and download a PDF directly from resume data (no html2canvas). */
export function exportResumeDataToPdf(
  data: ResumeData,
  mode: ResumeMode,
  filename = "resume.pdf",
): void {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const maxW = pageWidth - MARGIN * 2;
  let y = MARGIN;

  const accent: [number, number, number] =
    mode === "student" ? [37, 99, 235] : [83, 70, 229];

  const ensure = (needed: number): void => {
    if (y + needed > PAGE_BOTTOM) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  const writeLines = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const size = opts.size ?? 10;
    const gap = opts.gap ?? LINE;
    pdf.setFontSize(size);
    pdf.setFont("helvetica", opts.bold ? "bold" : "normal");
    if (opts.color) pdf.setTextColor(...opts.color);
    else pdf.setTextColor(30, 41, 59);

    const lines: string[] = pdf.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensure(gap);
      pdf.text(line, MARGIN, y);
      y += gap;
    }
  };

  const sectionHeading = (title: string) => {
    ensure(14);
    y += 4;
    pdf.setDrawColor(...accent);
    pdf.setLineWidth(0.35);
    pdf.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 5;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...accent);
    pdf.text(title.toUpperCase(), MARGIN, y);
    y += 7;
    pdf.setTextColor(30, 41, 59);
  };

  // —— Header ——
  ensure(20);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(15, 23, 42);
  pdf.text(data.fullName.trim() || "Your Name", MARGIN, y);
  y += 9;

  if (data.jobTitle.trim()) {
    writeLines(data.jobTitle.trim(), { size: 12, bold: true, color: accent, gap: 6 });
  }

  const contact = [data.email, data.phone, data.location, data.linkedin]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("  |  ");

  if (contact) {
    writeLines(contact, { size: 9, color: [100, 116, 139], gap: 4.5 });
  }

  if (mode === "student") {
    ensure(6);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...accent);
    pdf.text("STUDENT RESUME", MARGIN, y);
    y += 6;
  }

  y += 2;

  // —— Summary ——
  if (data.summary.trim()) {
    sectionHeading(mode === "student" ? "Objective" : "Professional Summary");
    writeLines(data.summary.trim());
    y += 2;
  }

  const renderExperience = () => {
    const items = data.experiences.filter((e) => e.company.trim() || e.role.trim());
    if (!items.length) return;

    sectionHeading(mode === "student" ? "Experience & Projects" : "Experience");

    for (const exp of items) {
      const title = `${exp.role.trim() || "Role"}${exp.company.trim() ? ` — ${exp.company.trim()}` : ""}`;
      writeLines(title, { bold: true, size: 10 });

      const dates = [exp.startDate.trim(), exp.endDate.trim() || (exp.startDate.trim() ? "Present" : "")]
        .filter(Boolean)
        .join(" – ");

      if (dates) {
        writeLines(dates, { size: 9, color: [100, 116, 139], gap: 4.5 });
      }

      if (exp.description.trim()) {
        writeLines(exp.description.trim(), { size: 10 });
      }
      y += 2;
    }
  };

  const renderEducation = () => {
    const items = data.education.filter((e) => e.school.trim() || e.degree.trim());
    if (!items.length) return;

    sectionHeading("Education");

    for (const edu of items) {
      let line = edu.degree.trim() || "Degree";
      if (edu.school.trim()) line += ` — ${edu.school.trim()}`;
      if (edu.year.trim()) line += ` (${edu.year.trim()})`;
      writeLines(line);
    }
    y += 2;
  };

  if (mode === "student") {
    renderEducation();
    renderExperience();
  } else {
    renderExperience();
    renderEducation();
  }

  if (data.skills.length > 0) {
    sectionHeading("Skills");
    writeLines(data.skills.join(" · "));
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
