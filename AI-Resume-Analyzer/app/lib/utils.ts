import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // Determine the appropriate unit by calculating the log
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Format with 2 decimal places and round
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

export type ScoreTier = "good" | "average" | "poor";

export interface ScoreTierInfo {
  tier: ScoreTier;
  label: string;
  textColor: string;
  bgColor: string;
  badgeTextClass: string;
  icon: "/icons/check.svg" | "/icons/warning.svg";
  atsIcon: string;
}

export function getScoreTier(score: number): ScoreTierInfo {
  if (score > 69) {
    return {
      tier: "good",
      label: "Strong",
      textColor: "text-green-600",
      bgColor: "bg-badge-green",
      badgeTextClass: "text-badge-green-text",
      icon: "/icons/check.svg",
      atsIcon: "/icons/ats-good.svg",
    };
  }
  if (score > 49) {
    return {
      tier: "average",
      label: "Good Start",
      textColor: "text-yellow-600",
      bgColor: "bg-badge-yellow",
      badgeTextClass: "text-badge-yellow-text",
      icon: "/icons/warning.svg",
      atsIcon: "/icons/ats-warning.svg",
    };
  }
  return {
    tier: "poor",
    label: "Needs Work",
    textColor: "text-red-600",
    bgColor: "bg-badge-red",
    badgeTextClass: "text-badge-red-text",
    icon: "/icons/warning.svg",
    atsIcon: "/icons/ats-bad.svg",
  };
}