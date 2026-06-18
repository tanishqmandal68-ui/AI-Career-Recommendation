import { describe, it, expect, vi } from "vitest";
import { cn, formatSize, generateUUID } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("returns empty string with no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatSize", () => {
  it("returns '0 Bytes' for 0", () => {
    expect(formatSize(0)).toBe("0 Bytes");
  });

  it("formats bytes", () => {
    expect(formatSize(500)).toBe("500 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatSize(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatSize(1048576)).toBe("1 MB");
  });

  it("formats with decimals", () => {
    expect(formatSize(1536)).toBe("1.5 KB");
  });

  it("formats gigabytes", () => {
    expect(formatSize(1073741824)).toBe("1 GB");
  });

  it("formats large fractional values", () => {
    expect(formatSize(5242880)).toBe("5 MB");
  });
});

describe("generateUUID", () => {
  it("returns a string", () => {
    expect(typeof generateUUID()).toBe("string");
  });

  it("returns unique values on successive calls", () => {
    const a = generateUUID();
    const b = generateUUID();
    expect(a).not.toBe(b);
  });
});
