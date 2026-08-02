type AssetsFetcher = {
  fetch(request: Request): Promise<Response>;
};

type WorkerEnv = {
  ASSETS: AssetsFetcher;
  BYPASS_GEOLOCATION_CHECK?: string;
};

type RequestWithCountry = Request & {
  cf?: {
    country?: string;
  };
};

const MERKL_PROXY_PREFIX = '/api/merkl';
const MERKL_UPSTREAM = 'https://api.merkl.xyz';

async function proxyMerkl(request: Request, url: URL): Promise<Response> {
  const upstreamPath = url.pathname.slice(MERKL_PROXY_PREFIX.length) || '/';
  const upstream = new URL(upstreamPath + url.search, MERKL_UPSTREAM);

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('cf-connecting-ip');
  headers.delete('cf-ipcountry');

  const upstreamReq = new Request(upstream.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'follow',
  });

  const upstreamRes = await fetch(upstreamReq);
  const resHeaders = new Headers(upstreamRes.headers);
  resHeaders.set('access-control-allow-origin', request.headers.get('origin') ?? '*');
  resHeaders.set('access-control-allow-methods', 'GET,POST,OPTIONS');
  resHeaders.set('access-control-allow-headers', 'content-type,authorization');

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: resHeaders,
  });
}

export default {
  async fetch(request: RequestWithCountry, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === MERKL_PROXY_PREFIX || url.pathname.startsWith(`${MERKL_PROXY_PREFIX}/`)) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'access-control-allow-origin': request.headers.get('origin') ?? '*',
            'access-control-allow-methods': 'GET,POST,OPTIONS',
            'access-control-allow-headers': 'content-type,authorization',
            'access-control-max-age': '86400',
          },
        });
      }
      return proxyMerkl(request, url);
    }

    const bypassGeolocationCheck = env.BYPASS_GEOLOCATION_CHECK === 'true';
    const blocked = [
      'CU', 'IR', 'KP', 'RU', 'SY', 'AF', 'BY', 'MM', 'VE', 'SS', 'SD', 'LY', 'SO', 'YE', 'NI', 'CF', 'CD',
      'CG', 'ML', 'ET', 'IQ', 'LB', 'BI', 'GW', 'CI', 'LR', 'US', 'ZW',
    ];

    const country = request.cf?.country ?? '';

    if (!bypassGeolocationCheck && blocked.includes(country) && !url.pathname.startsWith('/blocked')) {
      return Response.redirect(new URL('/blocked', request.url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },
};
