import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No movies found"
        description="Try a different search term."
      />
    );
    expect(screen.getByText("No movies found")).toBeInTheDocument();
    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
  });

  it("renders the action link when provided", () => {
    render(
      <EmptyState
        title="Error"
        description="Something broke."
        action={{ label: "Go home", href: "/" }}
      />
    );
    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("does not render action link when not provided", () => {
    render(
      <EmptyState title="Nothing here" description="No items available." />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("has correct role for accessibility", () => {
    render(<EmptyState title="Empty" description="Nothing to show." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
