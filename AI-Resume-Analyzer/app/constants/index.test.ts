import { describe, it, expect } from "vitest";
import { resumes, AIResponseFormat, prepareInstructions } from "./index";

describe("resumes constant", () => {
  it("contains 6 resume entries", () => {
    expect(resumes).toHaveLength(6);
  });

  it("each resume has required fields", () => {
    for (const r of resumes) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("companyName");
      expect(r).toHaveProperty("jobTitle");
      expect(r).toHaveProperty("imagePath");
      expect(r).toHaveProperty("resumePath");
      expect(r).toHaveProperty("feedback");
      expect(r.feedback).toHaveProperty("overallScore");
    }
  });

  it("has unique ids", () => {
    const ids = resumes.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each feedback has required categories", () => {
    for (const r of resumes) {
      const fb = r.feedback;
      expect(fb).toHaveProperty("ATS");
      expect(fb).toHaveProperty("toneAndStyle");
      expect(fb).toHaveProperty("content");
      expect(fb).toHaveProperty("structure");
      expect(fb).toHaveProperty("skills");
    }
  });

  it("scores are within 0-100 range", () => {
    for (const r of resumes) {
      expect(r.feedback.overallScore).toBeGreaterThanOrEqual(0);
      expect(r.feedback.overallScore).toBeLessThanOrEqual(100);
    }
  });
});

describe("AIResponseFormat", () => {
  it("is a non-empty string", () => {
    expect(AIResponseFormat.length).toBeGreaterThan(0);
  });

  it("contains Feedback interface definition", () => {
    expect(AIResponseFormat).toContain("interface Feedback");
    expect(AIResponseFormat).toContain("overallScore");
    expect(AIResponseFormat).toContain("ATS");
    expect(AIResponseFormat).toContain("toneAndStyle");
    expect(AIResponseFormat).toContain("content");
    expect(AIResponseFormat).toContain("structure");
    expect(AIResponseFormat).toContain("skills");
  });
});

describe("prepareInstructions", () => {
  it("includes the provided job title", () => {
    const result = prepareInstructions({
      jobTitle: "Software Engineer",
      jobDescription: "Build cool stuff",
    });
    expect(result).toContain("Software Engineer");
  });

  it("includes the provided job description", () => {
    const result = prepareInstructions({
      jobTitle: "Designer",
      jobDescription: "Design user interfaces",
    });
    expect(result).toContain("Design user interfaces");
  });

  it("includes the AI response format", () => {
    const result = prepareInstructions({
      jobTitle: "Dev",
      jobDescription: "Code",
    });
    expect(result).toContain("interface Feedback");
    expect(result).toContain("Return only the JSON object");
  });

  it("instructs to return valid JSON", () => {
    const result = prepareInstructions({
      jobTitle: "PM",
      jobDescription: "Manage projects",
    });
    expect(result).toContain("valid JSON");
    expect(result).toContain("Do not include");
    expect(result).toContain("Markdown");
  });
});
