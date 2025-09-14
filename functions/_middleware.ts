export const onRequest: PagesFunction = async (ctx) => {
  const blocked = [
    "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
    "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","US","ZW"
  ];

  const country = (ctx.request as any).cf?.country || "";
  const url = new URL(ctx.request.url);

  // avoid loops; let CORS preflights pass
  if (
    blocked.includes(country) &&
    !url.pathname.startsWith("/blocked") &&
    ctx.request.method !== "OPTIONS"
  ) {
    return Response.redirect("https://app.diversifi.tech/blocked", 302);
  }

  return ctx.next();
};