import { supabase } from "@/integrations/supabase/client";
import { bankRouteMapDE } from "@/lib/banks";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Local keyword match → bank key from bankRouteMapDE, or null. */
function localMatch(name: string): string | null {
  const n = normalize(name);
  // Order matters: more specific first.
  const rules: Array<[RegExp, string]> = [
    [/\bcomdirect\b/, "comdirect"],
    [/\bcommerzbank\b/, "Commerzbank"],
    [/\bdkb\b|\bdeutsche kreditbank\b/, "DKB"],
    [/\bpostbank\b/, "Postbank"],
    [/\bhypovereinsbank\b|\bhvb\b|\bunicredit\b/, "HypoVereinsbank"],
    [/\b1822\b|\b1822direkt\b/, "1822direkt"],
    [/\bnorisbank\b|\bnoris bank\b/, "norisbank"],
    [/\btargobank\b|\btargo bank\b/, "Targobank"],
    [/\bopenbank\b/, "Openbank"],
    [/\bconsorsbank\b|\bconsors\b/, "Consorsbank"],
    [/\bapobank\b|\bapotheker|\bdeutsche apotheker\b/, "apoBank"],
    [/\bsparda\b/, "Sparda-Bank West"],
    [/\bing\b|\bing diba\b|\bing-diba\b/, "ING"],
    [/\bsparkasse\b|\bsparkassen\b/, "Sparkasse"],
    [/\bvolksbank\b|\braiffeisenbank\b|\bgenossenschaft\b|\bvr bank\b|\bvr-bank\b/, "Berliner Volksbank"],
    [/\bdeutsche bank\b/, "Deutsche Bank"],
  ];
  for (const [re, key] of rules) if (re.test(n)) return key;
  return null;
}

/** Resolve a bank name (possibly abweichend) to a /de/* route, or null. */
export async function resolveDeBankRoute(name: string): Promise<string | null> {
  if (!name) return null;
  const local = localMatch(name);
  if (local && bankRouteMapDE[local]) return bankRouteMapDE[local];

  try {
    const { data, error } = await supabase.functions.invoke("match-bank-de", {
      body: { bankName: name, keys: Object.keys(bankRouteMapDE) },
    });
    if (error) return null;
    const key = (data as { key?: string | null })?.key;
    if (key && bankRouteMapDE[key]) return bankRouteMapDE[key];
  } catch {
    /* ignore */
  }
  return null;
}
