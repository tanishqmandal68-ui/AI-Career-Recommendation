import { describe, it, expect } from "vitest";
import {
  emptyExperience,
  emptyEducation,
  defaultResumeData,
} from "./resume";

describe("emptyExperience", () => {
  it("returns an object with empty strings", () => {
    const exp = emptyExperience();
    expect(exp.company).toBe("");
    expect(exp.role).toBe("");
    expect(exp.startDate).toBe("");
    expect(exp.endDate).toBe("");
    expect(exp.description).toBe("");
  });

  it("generates a unique id each time", () => {
    const a = emptyExperience();
    const b = emptyExperience();
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });
});

describe("emptyEducation", () => {
  it("returns an object with empty strings", () => {
    const edu = emptyEducation();
    expect(edu.school).toBe("");
    expect(edu.degree).toBe("");
    expect(edu.year).toBe("");
  });

  it("generates a unique id each time", () => {
    const a = emptyEducation();
    const b = emptyEducation();
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });
});

describe("defaultResumeData", () => {
  it("returns all string fields as empty", () => {
    const data = defaultResumeData();
    expect(data.fullName).toBe("");
    expect(data.jobTitle).toBe("");
    expect(data.email).toBe("");
    expect(data.phone).toBe("");
    expect(data.location).toBe("");
    expect(data.linkedin).toBe("");
    expect(data.summary).toBe("");
  });

  it("starts with one empty experience", () => {
    const data = defaultResumeData();
    expect(data.experiences).toHaveLength(1);
    expect(data.experiences[0].company).toBe("");
  });

  it("starts with one empty education", () => {
    const data = defaultResumeData();
    expect(data.education).toHaveLength(1);
    expect(data.education[0].school).toBe("");
  });

  it("starts with no skills", () => {
    const data = defaultResumeData();
    expect(data.skills).toEqual([]);
  });

  it("returns a new object each call (no shared refs)", () => {
    const a = defaultResumeData();
    const b = defaultResumeData();
    expect(a).not.toBe(b);
    expect(a.experiences).not.toBe(b.experiences);
    expect(a.education).not.toBe(b.education);
    expect(a.skills).not.toBe(b.skills);
  });
});
