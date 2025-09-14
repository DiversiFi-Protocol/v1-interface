//Cloudflare middleware for blocking sanctioned countries

export const onRequest: PagesFunction = async (ctx) => {
  const blocked = [
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","US","ZW" // keep "US" only for testing
  ];

  const req = ctx.request as Request & { cf?: any };
  const country = req.headers.get("cf-ipcountry") || req.cf?.country || "";
  const url = new URL(req.url);

  if (
    blocked.includes(country) &&
    !url.pathname.startsWith("/blocked") &&
    req.method !== "OPTIONS"
  ) {
    // valid redirect statuses: 301/302/303/307/308
    return Response.redirect("https://app.diversifi.tech/blocked", 302);
  }

  return ctx.next();
};