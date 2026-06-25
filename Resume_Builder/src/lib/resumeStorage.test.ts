import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAllResumes,
  getResumesForUser,
  getResumeById,
  saveResume,
  deleteResume,
  calcCompletion,
} from "./resumeStorage";
import type { ResumeData, SavedResume } from "../types/resume";

const RESUMES_KEY = "cn-resumes";

function makeSavedResume(overrides: Partial<SavedResume> = {}): SavedResume {
  return {
    id: "r1",
    userId: "u1",
    title: "My Resume",
    mode: "professional",
    data: makeResumeData(),
    updatedAt: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeResumeData(overrides: Partial<ResumeData> = {}): ResumeData {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    experiences: [{ id: "e1", company: "", role: "", startDate: "", endDate: "", description: "" }],
    education: [{ id: "ed1", school: "", degree: "", year: "" }],
    skills: [],
    ...overrides,
  };
}

describe("resumeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getAllResumes", () => {
    it("returns empty array when nothing stored", () => {
      expect(getAllResumes()).toEqual([]);
    });

    it("returns parsed resumes from localStorage", () => {
      const resumes = [makeSavedResume()];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      expect(getAllResumes()).toEqual(resumes);
    });

    it("returns empty array on corrupt JSON", () => {
      localStorage.setItem(RESUMES_KEY, "not-json");
      expect(getAllResumes()).toEqual([]);
    });
  });

  describe("getResumesForUser", () => {
    it("filters by userId", () => {
      const resumes = [
        makeSavedResume({ id: "r1", userId: "u1" }),
        makeSavedResume({ id: "r2", userId: "u2" }),
        makeSavedResume({ id: "r3", userId: "u1" }),
      ];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      const result = getResumesForUser("u1");
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.userId === "u1")).toBe(true);
    });

    it("sorts by updatedAt descending (newest first)", () => {
      const resumes = [
        makeSavedResume({ id: "r1", userId: "u1", updatedAt: "2025-01-01T00:00:00.000Z" }),
        makeSavedResume({ id: "r2", userId: "u1", updatedAt: "2025-06-15T00:00:00.000Z" }),
        makeSavedResume({ id: "r3", userId: "u1", updatedAt: "2025-03-10T00:00:00.000Z" }),
      ];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      const result = getResumesForUser("u1");
      expect(result[0].id).toBe("r2");
      expect(result[1].id).toBe("r3");
      expect(result[2].id).toBe("r1");
    });

    it("returns empty for unknown user", () => {
      localStorage.setItem(RESUMES_KEY, JSON.stringify([makeSavedResume()]));
      expect(getResumesForUser("unknown")).toEqual([]);
    });
  });

  describe("getResumeById", () => {
    it("returns the matching resume", () => {
      const resumes = [makeSavedResume({ id: "r1" }), makeSavedResume({ id: "r2" })];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      expect(getResumeById("r2")?.id).toBe("r2");
    });

    it("returns undefined for unknown id", () => {
      localStorage.setItem(RESUMES_KEY, JSON.stringify([makeSavedResume()]));
      expect(getResumeById("nonexistent")).toBeUndefined();
    });
  });

  describe("saveResume", () => {
    it("adds a new resume", () => {
      const resume = makeSavedResume({ id: "new1" });
      saveResume(resume);
      const stored = JSON.parse(localStorage.getItem(RESUMES_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe("new1");
    });

    it("updates an existing resume by id", () => {
      const original = makeSavedResume({ id: "r1", title: "Old" });
      localStorage.setItem(RESUMES_KEY, JSON.stringify([original]));

      const updated = makeSavedResume({ id: "r1", title: "New" });
      saveResume(updated);

      const stored = JSON.parse(localStorage.getItem(RESUMES_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe("New");
    });

    it("appends when id does not exist", () => {
      const existing = makeSavedResume({ id: "r1" });
      localStorage.setItem(RESUMES_KEY, JSON.stringify([existing]));

      saveResume(makeSavedResume({ id: "r2" }));
      const stored = JSON.parse(localStorage.getItem(RESUMES_KEY)!);
      expect(stored).toHaveLength(2);
    });
  });

  describe("deleteResume", () => {
    it("removes the resume with the given id", () => {
      const resumes = [makeSavedResume({ id: "r1" }), makeSavedResume({ id: "r2" })];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      deleteResume("r1");
      const stored = JSON.parse(localStorage.getItem(RESUMES_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe("r2");
    });

    it("no-ops for unknown id", () => {
      const resumes = [makeSavedResume({ id: "r1" })];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      deleteResume("nonexistent");
      const stored = JSON.parse(localStorage.getItem(RESUMES_KEY)!);
      expect(stored).toHaveLength(1);
    });
  });

  describe("calcCompletion", () => {
    it("returns 0 for empty resume data", () => {
      expect(calcCompletion(makeResumeData())).toBe(0);
    });

    it("returns 100 for fully filled resume", () => {
      const data = makeResumeData({
        fullName: "John Doe",
        email: "john@example.com",
        jobTitle: "Engineer",
        summary: "A summary",
        phone: "555-1234",
        experiences: [{ id: "e1", company: "Acme", role: "Dev", startDate: "", endDate: "", description: "" }],
        education: [{ id: "ed1", school: "MIT", degree: "CS", year: "" }],
        skills: ["JS", "TS"],
      });
      expect(calcCompletion(data)).toBe(100);
    });

    it("returns partial completion", () => {
      const data = makeResumeData({
        fullName: "Jane",
        email: "jane@example.com",
      });
      // 2 of 8 fields = 25%
      expect(calcCompletion(data)).toBe(25);
    });

    it("counts experiences only if company AND role are set", () => {
      const data = makeResumeData({
        experiences: [{ id: "e1", company: "Co", role: "", startDate: "", endDate: "", description: "" }],
      });
      expect(calcCompletion(data)).toBe(0);
    });

    it("counts education only if school AND degree are set", () => {
      const data = makeResumeData({
        education: [{ id: "ed1", school: "School", degree: "", year: "" }],
      });
      expect(calcCompletion(data)).toBe(0);
    });

    it("counts skills when array has items", () => {
      const data = makeResumeData({ skills: ["React"] });
      // 1 of 8 = 13%
      expect(calcCompletion(data)).toBe(13);
    });
  });
});
