//Cloudflare middleware for blocking sanctioned countries

export const onRequest: PagesFunction = async (ctx) => {
  const blocked = [
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","ZW" // remove "US" after testing
  ];

  const req = ctx.request as Request & { cf?: any };
  const url = new URL(req.url);

  const country = req.headers.get("cf-ipcountry") || req.cf?.country || "";
  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();   // 'document','style','script','image',...
  const mode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();   // 'navigate','cors',...
  const accept = (req.headers.get("accept") || "").toLowerCase();

  const isPreflight = req.method === "OPTIONS";
  const isBlocked = blocked.includes(country);
  const onBlockedPage = url.pathname.startsWith("/blocked");

  // treat only *navigations* as redirect candidates
  const isNavigation =
    dest === "document" || mode === "navigate" || accept.includes("text/html");

  if (!isBlocked || isPreflight) {
    return ctx.next();
  }

  if (!onBlockedPage && isNavigation) {
    // valid redirect status (302). no-store to avoid caching the redirect
    return new Response(null, {
      status: 302,
      headers: { Location: "https://app.diversifi.tech/blocked", "Cache-Control": "no-store" },
    });
  }

  // For subresource requests (CSS/JS/images), just let them load.
  // This avoids redirecting a stylesheet/script to an HTML page.
  return ctx.next();
};
