//Cloudflare middleware for blocking sanctioned countries

export const onRequest: PagesFunction = async (ctx) => {
  const blocked = [
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","ZW" // remove "US" unless testing
  ];

  const req = ctx.request as Request & { cf?: any };
  const url = new URL(req.url);

  const country = req.headers.get("cf-ipcountry") || req.cf?.country || "";
  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();
  const mode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();
  const accept = (req.headers.get("accept") || "").toLowerCase();
  const referer = req.headers.get("referer") || "";

  const isBlocked = blocked.includes(country);
  const isNavigation = dest === "document" || mode === "navigate" || accept.includes("text/html");
  const onBlockedPage = url.pathname === "/blocked" || url.pathname.startsWith("/blocked/");
  const isPreflight = req.method === "OPTIONS";

  // helper to append/ensure Vary header
  const setVary = (res: Response, name: string) => {
    const prev = res.headers.get("Vary");
    res.headers.set("Vary", prev ? `${prev}, ${name}` : name);
  };

  if (!isBlocked || isPreflight) {
    const res = await ctx.next();
    const out = new Response(res.body, res);
    setVary(out, "CF-IPCountry");
    out.headers.set("Cache-Control", "no-store");         // avoid sticky HTML
    return out;
  }

  // ---- Blocked visitors only ----
  if (!onBlockedPage && isNavigation) {
    const out = new Response(null, {
      status: 302,
      headers: {
        Location: "https://app.diversifi.tech/blocked",
        "Cache-Control": "no-store",
        "Clear-Site-Data": "\"cache\", \"cookies\", \"storage\"" // nuke stale SW/cache
      }
    });
    setVary(out, "CF-IPCountry");
    return out;
  }

  // Allow only the /blocked page and its own assets; block everything else
  if (onBlockedPage) {
    const res = await ctx.next();
    const out = new Response(res.body, res);
    setVary(out, "CF-IPCountry");
    out.headers.set("Cache-Control", "no-store");
    return out;
  }

  const out = new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  setVary(out, "CF-IPCountry");
  return out;
};
