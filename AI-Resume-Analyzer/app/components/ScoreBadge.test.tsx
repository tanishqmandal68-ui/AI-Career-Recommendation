import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreBadge from "./ScoreBadge";

describe("ScoreBadge", () => {
  it("shows 'Strong' for score > 70", () => {
    render(<ScoreBadge score={85} />);
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("shows 'Good Start' for score 50-70", () => {
    render(<ScoreBadge score={60} />);
    expect(screen.getByText("Good Start")).toBeInTheDocument();
  });

  it("shows 'Needs Work' for score < 50", () => {
    render(<ScoreBadge score={30} />);
    expect(screen.getByText("Needs Work")).toBeInTheDocument();
  });

  it("shows 'Strong' for score exactly 71", () => {
    render(<ScoreBadge score={71} />);
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("shows 'Good Start' for score exactly 50", () => {
    render(<ScoreBadge score={50} />);
    expect(screen.getByText("Good Start")).toBeInTheDocument();
  });

  it("shows 'Needs Work' for score exactly 49", () => {
    render(<ScoreBadge score={49} />);
    expect(screen.getByText("Needs Work")).toBeInTheDocument();
  });

  it("shows 'Strong' for score 100", () => {
    render(<ScoreBadge score={100} />);
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("shows 'Needs Work' for score 0", () => {
    render(<ScoreBadge score={0} />);
    expect(screen.getByText("Needs Work")).toBeInTheDocument();
  });

  it("applies green color classes for high scores", () => {
    const { container } = render(<ScoreBadge score={80} />);
    const badge = container.firstElementChild;
    expect(badge?.className).toContain("bg-badge-green");
    expect(badge?.className).toContain("text-green-600");
  });

  it("applies yellow color classes for medium scores", () => {
    const { container } = render(<ScoreBadge score={55} />);
    const badge = container.firstElementChild;
    expect(badge?.className).toContain("bg-badge-yellow");
    expect(badge?.className).toContain("text-yellow-600");
  });

  it("applies red color classes for low scores", () => {
    const { container } = render(<ScoreBadge score={20} />);
    const badge = container.firstElementChild;
    expect(badge?.className).toContain("bg-badge-red");
    expect(badge?.className).toContain("text-red-600");
  });
});
