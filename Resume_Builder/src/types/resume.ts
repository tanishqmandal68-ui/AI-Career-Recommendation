export type ResumeMode = "student" | "professional";

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

export interface SavedResume {
  id: string;
  userId: string;
  title: string;
  mode: ResumeMode;
  data: ResumeData;
  updatedAt: string;
}

export const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  school: "",
  degree: "",
  year: "",
});

export const defaultResumeData = (): ResumeData => ({
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  experiences: [emptyExperience()],
  education: [emptyEducation()],
  skills: [],
});
