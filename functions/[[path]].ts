//Cloudflare middleware for blocking sanctioned countries

export const onRequest: PagesFunction = async (ctx) => {
  // --- Config ---
  const BLOCKED = new Set([
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","ZW"
    // Add "US" ONLY while testing from the US, then remove it.
  ]);

  const req = ctx.request as Request & { cf?: any };
  const url = new URL(req.url);

  // Cloudflare geolocation (either header or req.cf.country)
  const country = (req.headers.get("cf-ipcountry") || req.cf?.country || "").toUpperCase();

  // Helper to ensure Vary + no-store on every response
  const stamp = (res: Response, extra?: Record<string,string>) => {
    const out = new Response(res.body, res);
    // Make cache country-aware and effectively disabled for HTML
    const prevVary = out.headers.get("Vary");
    out.headers.set("Vary", prevVary ? prevVary + ", CF-IPCountry" : "CF-IPCountry");
    out.headers.set("Cache-Control", "no-store");
    if (extra) for (const [k,v] of Object.entries(extra)) out.headers.set(k, v);
    return out;
  };

  const isBlockedCountry = BLOCKED.has(country);
  const onBlockedPage = url.pathname === "/blocked" || url.pathname.startsWith("/blocked/");

  if (!isBlockedCountry) {
    // Allowed traffic: pass through, mark headers for debugging
    const res = await ctx.next();
    return stamp(res, { "x-country": country || "NONE", "x-blocked": "0" });
  }

  // ------- Blocked traffic below -------
  // Allow only the /blocked page and its own assets. Everything else is denied.
  if (onBlockedPage) {
    const res = await ctx.next();
    return stamp(res, { "x-country": country, "x-blocked": "1", "x-allowed-path": "/blocked" });
  }

  // For any other path, do a clean redirect for navigations, otherwise 403.
  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();
  const mode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();
  const accept = (req.headers.get("accept") || "").toLowerCase();
  const isNavigation = dest === "document" || mode === "navigate" || accept.includes("text/html");
  if (isNavigation) {
    return stamp(new Response(null, {
      status: 302,
      headers: {
        Location: "https://app.diversifi.tech/blocked",
        "Clear-Site-Data": "\"cache\", \"cookies\", \"storage\"" // nuke stale SW/cache on client
      }
    }), { "x-country": country, "x-blocked": "1", "x-redirect": "1" });
  }
  return stamp(new Response("Forbidden", { status: 403 }), { "x-country": country, "x-blocked": "1", "x-redirect": "0" });
};
