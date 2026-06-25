import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";

function renderAccordion({
  defaultOpen,
  allowMultiple,
}: { defaultOpen?: string; allowMultiple?: boolean } = {}) {
  return render(
    <Accordion defaultOpen={defaultOpen} allowMultiple={allowMultiple}>
      <AccordionItem id="item-1">
        <AccordionHeader itemId="item-1">Header 1</AccordionHeader>
        <AccordionContent itemId="item-1">Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem id="item-2">
        <AccordionHeader itemId="item-2">Header 2</AccordionHeader>
        <AccordionContent itemId="item-2">Content 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders headers", () => {
    renderAccordion();
    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Header 2")).toBeInTheDocument();
  });

  it("all content is hidden by default", () => {
    renderAccordion();
    const content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    const content2 = screen.getByText("Content 2").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-0");
    expect(content2?.className).toContain("max-h-0");
  });

  it("opens default item", () => {
    renderAccordion({ defaultOpen: "item-1" });
    const content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-fit");
  });

  it("toggles item on click", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText("Header 1"));
    const content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-fit");

    await user.click(screen.getByText("Header 1"));
    const content1After = screen.getByText("Content 1").closest("div[class*='max-h']");
    expect(content1After?.className).toContain("max-h-0");
  });

  it("single mode: opening one closes others", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText("Header 1"));
    let content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-fit");

    await user.click(screen.getByText("Header 2"));
    content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    const content2 = screen.getByText("Content 2").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-0");
    expect(content2?.className).toContain("max-h-fit");
  });

  it("multiple mode: can have multiple items open", async () => {
    const user = userEvent.setup();
    renderAccordion({ allowMultiple: true });

    await user.click(screen.getByText("Header 1"));
    await user.click(screen.getByText("Header 2"));

    const content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    const content2 = screen.getByText("Content 2").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-fit");
    expect(content2?.className).toContain("max-h-fit");
  });

  it("multiple mode: toggling closes only that item", async () => {
    const user = userEvent.setup();
    renderAccordion({ allowMultiple: true });

    await user.click(screen.getByText("Header 1"));
    await user.click(screen.getByText("Header 2"));
    await user.click(screen.getByText("Header 1"));

    const content1 = screen.getByText("Content 1").closest("div[class*='max-h']");
    const content2 = screen.getByText("Content 2").closest("div[class*='max-h']");
    expect(content1?.className).toContain("max-h-0");
    expect(content2?.className).toContain("max-h-fit");
  });
});
