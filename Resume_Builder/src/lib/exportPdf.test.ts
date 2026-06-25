import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ResumeData, ResumeMode } from "../types/resume";

function makeResumeData(overrides: Partial<ResumeData> = {}): ResumeData {
  return {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    email: "john@example.com",
    phone: "555-1234",
    location: "NYC",
    linkedin: "linkedin.com/in/john",
    summary: "Experienced developer",
    experiences: [
      {
        id: "e1",
        company: "Acme Corp",
        role: "Senior Dev",
        startDate: "2020-01",
        endDate: "2024-01",
        description: "Built things",
      },
    ],
    education: [
      { id: "ed1", school: "MIT", degree: "CS", year: "2019" },
    ],
    skills: ["JavaScript", "TypeScript", "React"],
    ...overrides,
  };
}

const mockSave = vi.fn();
const mockAddPage = vi.fn();
const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetLineWidth = vi.fn();
const mockLine = vi.fn();
const mockSplitTextToSize = vi.fn((text: string) => [text]);

vi.mock("jspdf", () => {
  function MockJsPDF() {
    return {
      internal: { pageSize: { getWidth: () => 210 } },
      save: mockSave,
      addPage: mockAddPage,
      text: mockText,
      setFont: mockSetFont,
      setFontSize: mockSetFontSize,
      setTextColor: mockSetTextColor,
      setDrawColor: mockSetDrawColor,
      setLineWidth: mockSetLineWidth,
      line: mockLine,
      splitTextToSize: mockSplitTextToSize,
    };
  }
  return { jsPDF: MockJsPDF };
});

describe("exportResumeDataToPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls pdf.save with the given filename", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "professional", "my-resume.pdf");
    expect(mockSave).toHaveBeenCalledWith("my-resume.pdf");
  });

  it("appends .pdf if missing", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "professional", "my-resume");
    expect(mockSave).toHaveBeenCalledWith("my-resume.pdf");
  });

  it("uses default filename when none provided", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "professional");
    expect(mockSave).toHaveBeenCalledWith("resume.pdf");
  });

  it("renders the full name in header", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "professional");
    expect(mockText).toHaveBeenCalledWith("John Doe", expect.any(Number), expect.any(Number));
  });

  it("renders 'Your Name' when fullName is empty", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData({ fullName: "  " }), "professional");
    expect(mockText).toHaveBeenCalledWith("Your Name", expect.any(Number), expect.any(Number));
  });

  it("renders student mode label", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "student");
    expect(mockText).toHaveBeenCalledWith(
      "STUDENT RESUME",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("renders skills section", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(
      makeResumeData({ skills: ["JS", "TS"] }),
      "professional"
    );
    expect(mockText).toHaveBeenCalledWith(
      "SKILLS",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("does not render skills section if skills empty", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData({ skills: [] }), "professional");
    const skillsCalls = mockText.mock.calls.filter(
      (call: any[]) => call[0] === "SKILLS"
    );
    expect(skillsCalls).toHaveLength(0);
  });

  it("does not render summary section if summary is empty", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData({ summary: "" }), "professional");
    const summaryCalls = mockText.mock.calls.filter(
      (call: any[]) => call[0] === "PROFESSIONAL SUMMARY"
    );
    expect(summaryCalls).toHaveLength(0);
  });

  it("uses 'Objective' heading in student mode", async () => {
    const { exportResumeDataToPdf } = await import("./exportPdf");
    exportResumeDataToPdf(makeResumeData(), "student");
    expect(mockText).toHaveBeenCalledWith(
      "OBJECTIVE",
      expect.any(Number),
      expect.any(Number)
    );
  });
});
