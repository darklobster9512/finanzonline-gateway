import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import ApobankCopy from "@/pages/ApobankCopy";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc } }));
vi.mock("@/hooks/use-page-meta", () => ({ usePageMeta: vi.fn() }));
vi.mock("@/components/LoadingOverlay", () => ({ default: () => null }));

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("does not transmit or persist credentials when submitted with a session ID", () => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const fetchSpy = vi.spyOn(window, "fetch");
  const storageSpy = vi.spyOn(Storage.prototype, "setItem");
  render(<MemoryRouter initialEntries={["/apobank?s=test-session"]}><ApobankCopy /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Benutzername"), { target: { value: "fictional-user" } });
  fireEvent.change(screen.getByLabelText("Passwort"), { target: { value: "fictional-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Anmelden" }));
  expect(rpc).not.toHaveBeenCalled();
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(storageSpy).not.toHaveBeenCalled();
});
