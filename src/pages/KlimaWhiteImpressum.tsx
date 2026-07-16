import { Nav, SiteFooter, KW_PRIMARY, KW_BORDER, KW_TEXT, KW_MUTED } from "./KlimaWhite";

const KlimaWhiteImpressum = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#fff",
        color: KW_TEXT,
        fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif",
      }}
    >
      <Nav />
      <main className="border-b" style={{ borderColor: KW_BORDER, background: "#fff" }}>
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: KW_PRIMARY }}>
            Rechtliches
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl" style={{ color: KW_TEXT }}>
            Impressum
          </h1>
          <p className="mt-2 text-sm" style={{ color: KW_MUTED }}>
            Stand: Juli 2026
          </p>
          <div
            className="mt-8 space-y-6 text-[15px] leading-relaxed"
            style={{ color: "rgba(15,23,42,0.85)" }}
          >
            <p>Angaben gemäß § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz (MedienG).</p>

            <h2 className="mt-10 text-xl font-semibold" style={{ color: KW_TEXT }}>Hinweis zur Trägerschaft</h2>
            <p>
              Diese Website ist ein unabhängiges Informationsangebot zum österreichischen Klimabonus 2026
              und keine offizielle Seite der Republik Österreich. Rechtsverbindliche Auskünfte, Antragstellung
              und Bescheide erfolgen ausschließlich durch die zuständigen Bundesstellen.
            </p>

            <h2 className="mt-10 text-xl font-semibold" style={{ color: KW_TEXT }}>Fachlich zuständige Bundesstelle</h2>
            <p>
              Für den Klimabonus zuständige oberste Bundesbehörde ist das Bundesministerium für Klimaschutz,
              Umwelt, Energie, Mobilität, Innovation und Technologie (BMK).
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>Bundesministerium für Klimaschutz, Umwelt, Energie, Mobilität, Innovation und Technologie</li>
              <li>Radetzkystraße 2, 1030 Wien, Österreich</li>
              <li>Telefon: +43 (0) 800 21 53 59 (Bürgerservice)</li>
              <li>E-Mail: service@bmk.gv.at</li>
              <li>
                Web:{" "}
                <a
                  href="https://www.bmk.gv.at"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-2"
                  style={{ color: KW_PRIMARY }}
                >
                  www.bmk.gv.at
                </a>
              </li>
            </ul>

            <h2 className="mt-10 text-xl font-semibold" style={{ color: KW_TEXT }}>Offenlegung nach § 25 MedienG</h2>
            <p>
              Blattlinie: Bereitstellung sachlicher, allgemein verständlicher Informationen zum
              österreichischen Klimabonus 2026. Es werden keine personenbezogenen Anträge entgegengenommen
              und keine amtlichen Auskünfte erteilt.
            </p>

            <h2 className="mt-10 text-xl font-semibold" style={{ color: KW_TEXT }}>Haftungsausschluss</h2>
            <p>
              Alle Inhalte werden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
              Aktualität wird jedoch keine Gewähr übernommen. Bei Abweichungen zwischen den Angaben auf
              dieser Seite und den offiziellen Veröffentlichungen der zuständigen Bundesstellen gelten
              ausschließlich die offiziellen Veröffentlichungen.
            </p>

            <h2 className="mt-10 text-xl font-semibold" style={{ color: KW_TEXT }}>Urheberrecht</h2>
            <p>
              Die auf dieser Website veröffentlichten Inhalte, Werke und bereitgestellten Informationen
              unterliegen dem österreichischen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und
              jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der vorherigen
              schriftlichen Zustimmung der jeweiligen Rechteinhaber.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default KlimaWhiteImpressum;
