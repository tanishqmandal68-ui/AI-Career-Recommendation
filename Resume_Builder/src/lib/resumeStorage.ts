import type { ResumeData, SavedResume } from "../types/resume";

const RESUMES_KEY = "cn-resumes";

export function getAllResumes(): SavedResume[] {
  try {
    const raw = localStorage.getItem(RESUMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getResumesForUser(userId: string): SavedResume[] {
  return getAllResumes()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getResumeById(id: string): SavedResume | undefined {
  return getAllResumes().find((r) => r.id === id);
}

export function saveResume(resume: SavedResume): void {
  const all = getAllResumes();
  const idx = all.findIndex((r) => r.id === resume.id);
  if (idx >= 0) all[idx] = resume;
  else all.push(resume);
  localStorage.setItem(RESUMES_KEY, JSON.stringify(all));
}

export function deleteResume(id: string): void {
  const all = getAllResumes().filter((r) => r.id !== id);
  localStorage.setItem(RESUMES_KEY, JSON.stringify(all));
}

export function calcCompletion(data: ResumeData): number {
  let filled = 0;
  const total = 8;
  if (data.fullName.trim()) filled++;
  if (data.email.trim()) filled++;
  if (data.jobTitle.trim()) filled++;
  if (data.summary.trim()) filled++;
  if (data.phone.trim()) filled++;
  if (data.experiences.some((e) => e.company && e.role)) filled++;
  if (data.education.some((e) => e.school && e.degree)) filled++;
  if (data.skills.length > 0) filled++;
  return Math.round((filled / total) * 100);
}
