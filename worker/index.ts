type WorkerEnv = {
  ASSETS: Fetcher;
};

type RequestWithCountry = Request & {
  cf?: {
    country?: string;
  };
};

export default {
  async fetch(request: RequestWithCountry, env: WorkerEnv): Promise<Response> {
    const blocked = [
      'CU', 'IR', 'KP', 'RU', 'SY', 'AF', 'BY', 'MM', 'VE', 'SS', 'SD', 'LY', 'SO', 'YE', 'NI', 'CF', 'CD',
      'CG', 'ML', 'ET', 'IQ', 'LB', 'BI', 'GW', 'CI', 'LR', 'US', 'ZW',
    ];

    const country = request.cf?.country ?? '';
    const url = new URL(request.url);

    if (blocked.includes(country) && !url.pathname.startsWith('/blocked')) {
      return Response.redirect(new URL('/blocked', request.url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },
};
