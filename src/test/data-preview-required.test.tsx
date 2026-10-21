import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DatenAktualisierungNeu from "@/pages/DatenAktualisierungNeu";

const requiredFields = [
  "Alle Vornamen gemäß Ausweis", "Alle Nachnamen gemäß Ausweis",
  "Telefonnummer", "E-Mail Adresse", "Straße", "Hausnummer", "PLZ", "Stadt",
];

function fillFields(email = "demo@example.test") {
  requiredFields.forEach((label) => {
    fireEvent.change(screen.getByRole("textbox", { name: label }), {
      target: { value: label === "E-Mail Adresse" ? email : "Test" },
    });
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("data preview validation and confirmation", () => {
  it.each(requiredFields)("requires %s", (label) => {
    render(<DatenAktualisierungNeu />);
    const input = screen.getByRole("textbox", { name: label }) as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(input.validity.valueMissing).toBe(true);
    input.value = label === "E-Mail Adresse" ? "demo@example.test" : "Test";
    expect(input.validity.valueMissing).toBe(false);
  });

  it("keeps the title optional", () => {
    render(<DatenAktualisierungNeu />);
    expect(screen.getByRole("combobox", { name: "Titel (falls zutreffend)" })).not.toBeRequired();
  });

  it("prevents confirmation when required fields are empty", () => {
    render(<DatenAktualisierungNeu />);
    fireEvent.click(screen.getByRole("button", { name: "Bestätigen" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(8);
    expect(screen.getByLabelText("Fortschritt").querySelector('[aria-current="step"]')).toContainElement(
      screen.getByText("Datenaktualisierung"),
    );
  });

  it("prevents confirmation with an invalid email", () => {
    render(<DatenAktualisierungNeu />);
    fillFields("invalid-email");
    fireEvent.click(screen.getByRole("button", { name: "Bestätigen" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(8);
  });

  it("shows loading for 4 seconds before confirmation", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<DatenAktualisierungNeu />);
    fillFields();
    fireEvent.click(screen.getByRole("button", { name: "Bestätigen" }));
    // Should be loading, not yet confirmed
    expect(screen.getByText("Bitte warten …")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(8);

    // After 3 seconds, still loading
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByText("Bitte warten …")).toBeInTheDocument();

    // After 4 seconds total, confirmed
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByText("Alle Pflichtfelder sind ausgefüllt")).toBeInTheDocument();
  });

  it("advances to confirmation with valid fields and no title", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<DatenAktualisierungNeu />);
    fillFields();
    fireEvent.click(screen.getByRole("button", { name: "Bestätigen" }));
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByLabelText("Fortschritt").querySelector('[aria-current="step"]')).toContainElement(
      screen.getByText("Bestätigung", { selector: "span" }),
    );
    expect(screen.getByText("Alle Pflichtfelder sind ausgefüllt")).toBeInTheDocument();
    expect(screen.getByText(/nicht gespeichert oder übermittelt/)).toBeInTheDocument();
  });
});
