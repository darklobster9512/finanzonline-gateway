import { cleanup, render, screen } from "@testing-library/react";
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
});
