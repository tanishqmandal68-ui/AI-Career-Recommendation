import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreCircle from "./ScoreCircle";

describe("ScoreCircle", () => {
  it("renders the score text", () => {
    render(<ScoreCircle score={75} />);
    expect(screen.getByText("75/100")).toBeInTheDocument();
  });

  it("renders with score 0", () => {
    render(<ScoreCircle score={0} />);
    expect(screen.getByText("0/100")).toBeInTheDocument();
  });

  it("renders with score 100", () => {
    render(<ScoreCircle score={100} />);
    expect(screen.getByText("100/100")).toBeInTheDocument();
  });

  it("renders an SVG element", () => {
    const { container } = render(<ScoreCircle score={50} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders two circle elements (background and progress)", () => {
    const { container } = render(<ScoreCircle score={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
  });

  it("progress circle uses gradient stroke", () => {
    const { container } = render(<ScoreCircle score={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[1].getAttribute("stroke")).toBe("url(#grad)");
  });
});
