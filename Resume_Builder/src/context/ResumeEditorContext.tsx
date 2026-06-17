import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calcCompletion, getResumeById, saveResume } from "../lib/resumeStorage";
import type { ResumeData, ResumeMode, SavedResume } from "../types/resume";

interface ResumeEditorContextValue {
  saved: SavedResume;
  data: ResumeData;
  mode: ResumeMode;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  completionPercent: number;
  persist: () => void;
}

const ResumeEditorContext = createContext<ResumeEditorContextValue | null>(null);

export function ResumeEditorProvider({
  resumeId,
  children,
}: {
  resumeId: string;
  children: ReactNode;
}) {
  const initial = getResumeById(resumeId);
  const [saved, setSaved] = useState<SavedResume | undefined>(initial);
  const [data, setData] = useState<ResumeData>(initial?.data ?? ({} as ResumeData));

  useEffect(() => {
    const current = getResumeById(resumeId);
    if (current) {
      setSaved(current);
      setData(current.data);
    }
  }, [resumeId]);

  const persist = useCallback(() => {
    if (!saved) return;
    const updated: SavedResume = {
      ...saved,
      data,
      updatedAt: new Date().toISOString(),
    };
    saveResume(updated);
  }, [saved, data]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(persist, 800);
    return () => clearTimeout(t);
  }, [data, persist, saved]);

  const completionPercent = useMemo(() => calcCompletion(data), [data]);

  if (!saved) return null;

  const value = useMemo(
    () => ({
      saved,
      data,
      mode: saved.mode,
      setData,
      completionPercent,
      persist,
    }),
    [saved, data, completionPercent, persist],
  );

  return (
    <ResumeEditorContext.Provider value={value}>{children}</ResumeEditorContext.Provider>
  );
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error("useResumeEditor must be used within ResumeEditorProvider");
  return ctx;
}
