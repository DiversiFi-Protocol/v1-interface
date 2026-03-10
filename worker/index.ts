export default {
  async fetch(request) {
    const blocked = [
      "CU","IR","KP","RU","SY","AF","BY","MM","VE","SS","SD","LY","SO","YE",
      "NI","CF","CD","CG","ML","ET","IQ","LB","BI","GW","CI","LR","US","ZW"
    ];
    const country = request.cf?.country || "";
    const url = new URL(request.url);

    // Only redirect if the visitor's country is blocked AND they're not already on /blocked
    if (blocked.includes(country) && !url.pathname.startsWith("/blocked")) {
      return Response.redirect("https://app.diversifi.tech/blocked", 302);
    }

    // Everyone else (non-blocked countries, or requests already on /blocked) are served normally
    return fetch(request);
  },
};