//Cloudflare middleware for blocking sanctioned countries

// Cloudflare Pages Function: hard block except /blocked for sanctioned countries
export const onRequest: PagesFunction = async (ctx) => {
  const blocked = [
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","US","ZW" // keep "US" only while testing
  ];

  const req = ctx.request as Request & { cf?: any };
  const url = new URL(req.url);

  const country = req.headers.get("cf-ipcountry") || req.cf?.country || "";
  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();   // 'document','script','style','image',...
  const mode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();   // 'navigate','cors',...
  const accept = (req.headers.get("accept") || "").toLowerCase();
  const referer = req.headers.get("referer") || "";

  const isBlocked = blocked.includes(country);
  const isNavigation = dest === "document" || mode === "navigate" || accept.includes("text/html");
  const onBlockedPage = url.pathname === "/blocked" || url.pathname.startsWith("/blocked/");

  if (!isBlocked) {
    // Non-blocked visitors: normal site
    return ctx.next();
  }

  // ---- Blocked visitors only below ----

  if (onBlockedPage) {
    // Allow the /blocked page itself and its *own* assets
    if (isNavigation) return ctx.next();

    // Allow subresources only when they are for the /blocked page
    if (url.pathname.startsWith("/blocked/") || referer.startsWith("https://app.diversifi.tech/blocked")) {
      return ctx.next();
    }

    // Anything else (e.g., app JS from /assets) is forbidden
    return new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  // For any other path:
  if (isNavigation) {
    // Redirect top-level navigation to /blocked (no cache)
    return new Response(null, {
      status: 302,
      headers: { Location: "https://app.diversifi.tech/blocked", "Cache-Control": "no-store" },
    });
  }

  // Block all non-navigation requests (JS/CSS/API/img) outside /blocked for blocked users
  return new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
};
