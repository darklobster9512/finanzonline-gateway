import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoHeader } from "@/pages/ApobankAktualisierung";

export default function ApobankCopy() {
  const navigate = useNavigate();
  useEffect(() => { document.title = "Demo-Anmeldung – Musterportal"; }, []);
  return <div className="min-h-screen bg-background text-foreground">
    <DemoHeader />
    <main className="mx-auto max-w-2xl px-5 py-12">
      <FlaskConical className="mb-6 h-10 w-10 text-primary" aria-hidden="true" />
      <h1 className="mb-8 text-3xl">Demo-Anmeldung</h1>
      <form onSubmit={(event) => { event.preventDefault(); navigate("/apobank/aktualisierung"); }}>
        <div className="mb-6"><label htmlFor="demo-user" className="mb-2 block text-sm text-muted-foreground">Benutzername</label><input id="demo-user" value="demo.mustermann" readOnly className="min-h-11 w-full rounded border border-border bg-muted px-3 py-3" /></div>
        <div className="mb-8"><label htmlFor="demo-password" className="mb-2 block text-sm text-muted-foreground">Passwort</label><input id="demo-password" type="password" value="demo-testwert" readOnly className="min-h-11 w-full rounded border border-border bg-muted px-3 py-3" /></div>
        <Button type="submit" className="min-h-11">Anmelden<ArrowRight aria-hidden="true" /></Button>
      </form>
    </main>
  </div>;
}
