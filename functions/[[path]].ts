// Cloudflare Pages Function: allow only /blocked and its own assets for blocked countries
export const onRequest: PagesFunction = async (ctx) => {
  const BLOCKED = new Set([
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","US","ZW"
  ]);

  const req = ctx.request as Request & { cf?: any };
  const url = new URL(req.url);

  const country = (req.headers.get("cf-ipcountry") || req.cf?.country || "").toUpperCase();
  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();  // 'document','script','style','image',...
  const mode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();  // 'navigate','cors',...
  const accept = (req.headers.get("accept") || "").toLowerCase();
  const referer = req.headers.get("referer") || "";

  const isBlocked = BLOCKED.has(country);
  const isNavigation = dest === "document" || mode === "navigate" || accept.includes("text/html");
  const onBlockedPage = url.pathname === "/blocked" || url.pathname.startsWith("/blocked/");

  // Helper to make cache country-aware and avoid sticky cache
  const stamp = (res: Response, extra?: Record<string,string>) => {
    const out = new Response(res.body, res);
    const prevVary = out.headers.get("Vary");
    out.headers.set("Vary", prevVary ? `${prevVary}, CF-IPCountry` : "CF-IPCountry");
    out.headers.set("Cache-Control", "no-store");
    if (extra) for (const [k, v] of Object.entries(extra)) out.headers.set(k, v);
    return out;
  };

  if (!isBlocked) {
    const res = await ctx.next();
    return stamp(res, { "x-country": country, "x-blocked": "0" });
  }

  // ------- blocked visitors -------
  // If they request /blocked itself, allow it (and we’ll gate assets below).
  if (onBlockedPage) {
    const res = await ctx.next();
    return stamp(res, { "x-country": country, "x-blocked": "1", "x-allowed-path": "/blocked" });
  }

  // If it's a top-level navigation elsewhere, bounce to /blocked
  if (isNavigation) {
    return stamp(new Response(null, {
      status: 302,
      headers: {
        Location: "https://app.diversifi.tech/blocked",
        "Clear-Site-Data": "\"cache\", \"cookies\", \"storage\""
      }
    }), { "x-country": country, "x-blocked": "1", "x-redirect": "1" });
  }

  // Subresources (CSS/JS/img/fonts) are only allowed when the Referer is the /blocked page
  let allowSubresource = false;
  try {
    if (referer) {
      const r = new URL(referer);
      allowSubresource =
        r.origin === url.origin &&
        (r.pathname === "/blocked" || r.pathname.startsWith("/blocked/"));
    }
  } catch { /* bad referer → treat as not allowed */ }

  if (allowSubresource) {
    const res = await ctx.next();
    return stamp(res, { "x-country": country, "x-blocked": "1", "x-asset": "blocked-ok" });
  }

  // Everything else is forbidden
  return stamp(new Response("Forbidden", { status: 403 }), { "x-country": country, "x-blocked": "1", "x-asset": "blocked-deny" });
};
