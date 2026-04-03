import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/",
}));

import { SearchInput } from "@/components/features/SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the search input", () => {
    render(<SearchInput />);
    expect(
      screen.getByRole("searchbox", { name: /search movies/i })
    ).toBeInTheDocument();
  });

  it("has correct placeholder text", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Inception" } });
    expect(input.value).toBe("Inception");
  });

  it("shows clear button when input has value", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Inception" } });
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("hides clear button when input is empty", () => {
    render(<SearchInput />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });

  it("clears input when clear button is clicked", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Batman" } });
    expect(input.value).toBe("Batman");

    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(input.value).toBe("");
  });
});
