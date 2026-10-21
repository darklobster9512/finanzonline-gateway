import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import DatenAktualisierungNeu from "@/pages/DatenAktualisierungNeu";

afterEach(cleanup);

describe("data preview required fields", () => {
  it.each([
    "Alle Vornamen gemäß Ausweis",
    "Alle Nachnamen gemäß Ausweis",
    "Telefonnummer",
    "E-Mail Adresse",
    "Straße",
    "Hausnummer",
    "PLZ",
    "Stadt",
  ])("requires %s", (label) => {
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

  it("shows the confirm button labelled 'Bestätigen'", () => {
    render(<DatenAktualisierungNeu />);
    const btn = screen.getByRole("button", { name: "Bestätigen" });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("shows confirmation view after clicking Bestätigen with all required fields filled", () => {
    render(<DatenAktualisierungNeu />);
    // Fill all required fields
    const fields = [
      "Alle Vornamen gemäß Ausweis",
      "Alle Nachnamen gemäß Ausweis",
      "Telefonnummer",
      "Straße",
      "Hausnummer",
      "PLZ",
      "Stadt",
    ];
    fields.forEach((label) => {
      fireEvent.change(screen.getByRole("textbox", { name: label }), { target: { value: "Test" } });
    });
    fireEvent.change(screen.getByRole("textbox", { name: "E-Mail Adresse" }), { target: { value: "a@b.de" } });

    fireEvent.click(screen.getByRole("button", { name: "Bestätigen" }));
    expect(screen.getByText("Ihre Eingaben wurden bestätigt.")).toBeInTheDocument();
  });
});
