type WorkerEnv = {
  ASSETS: Fetcher;
  BYPASS_GEOLOCATION_CHECK?: string;
};

type RequestWithCountry = Request & {//bruh
  cf?: {
    country?: string;
  };
};

export default {
  async fetch(request: RequestWithCountry, env: WorkerEnv): Promise<Response> {
    const bypassGeolocationCheck = env.BYPASS_GEOLOCATION_CHECK === 'true';
    const blocked = [
      'CU', 'IR', 'KP', 'RU', 'SY', 'AF', 'BY', 'MM', 'VE', 'SS', 'SD', 'LY', 'SO', 'YE', 'NI', 'CF', 'CD',
      'CG', 'ML', 'ET', 'IQ', 'LB', 'BI', 'GW', 'CI', 'LR', 'US', 'ZW',
    ];

    const country = request.cf?.country ?? '';
    const url = new URL(request.url);

    if (!bypassGeolocationCheck && blocked.includes(country) && !url.pathname.startsWith('/blocked')) {
      return Response.redirect(new URL('/blocked', request.url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },
};
