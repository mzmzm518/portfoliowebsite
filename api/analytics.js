// Protected bridge between the portfolio editor and Vercel Web Analytics.
// The Vercel access token stays server-side and is never sent to the browser.

const GITHUB_OWNER = 'mzmzm518';
const VERCEL_API = 'https://api.vercel.com/v1/query/web-analytics/visits';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(JSON.stringify(body));
}

async function authorizedGithubOwner(req) {
  const auth = req.headers.authorization || '';
  const githubToken = auth.replace(/^Bearer\s+/i, '');
  if (!githubToken) return false;

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Mariam-Portfolio-Analytics'
    }
  });
  if (!response.ok) return false;
  const user = await response.json();
  return String(user.login || '').toLowerCase() === GITHUB_OWNER.toLowerCase();
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  try {
    if (!(await authorizedGithubOwner(req))) {
      return send(res, 401, { error: 'Please sign in with the website owner account.' });
    }

    const vercelToken = process.env.VERCEL_ANALYTICS_TOKEN;
    const projectId = process.env.ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.ANALYTICS_TEAM_ID || process.env.VERCEL_TEAM_ID;
    const teamSlug = process.env.ANALYTICS_TEAM_SLUG;

    if (!vercelToken || !projectId) {
      return send(res, 503, {
        setup: true,
        error: 'Analytics dashboard setup is not finished.',
        missing: [
          !vercelToken && 'VERCEL_ANALYTICS_TOKEN',
          !projectId && 'ANALYTICS_PROJECT_ID'
        ].filter(Boolean)
      });
    }

    const requestedDays = Number.parseInt(req.query && req.query.days, 10);
    const days = [7, 14, 30].includes(requestedDays) ? requestedDays : 30;
    const until = new Date();
    const since = new Date(until);
    since.setUTCDate(since.getUTCDate() - (days - 1));
    const date = value => value.toISOString().slice(0, 10);

    async function query(by, limit) {
      const params = new URLSearchParams({
        projectId,
        since: date(since),
        until: date(until),
        by
      });
      if (limit) params.set('limit', String(limit));
      if (teamId) params.set('teamId', teamId);
      else if (teamSlug) params.set('slug', teamSlug);

      const response = await fetch(`${VERCEL_API}/aggregate?${params}`, {
        headers: { Authorization: `Bearer ${vercelToken}` }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload.error && (payload.error.message || payload.error.code);
        throw new Error(message || `Vercel Analytics returned ${response.status}.`);
      }
      return Array.isArray(payload.data) ? payload.data : [];
    }

    const [daily, countries, referrers, devices, pages] = await Promise.all([
      query('day'),
      query('country', 8),
      query('referrerHostname', 8),
      query('deviceType', 8),
      query('requestPath', 10)
    ]);

    const totals = daily.reduce((sum, row) => ({
      pageviews: sum.pageviews + Number(row.pageviews || 0),
      visitors: sum.visitors + Number(row.visitors || 0)
    }), { pageviews: 0, visitors: 0 });

    return send(res, 200, {
      days,
      since: date(since),
      until: date(until),
      totals,
      daily,
      countries,
      referrers,
      devices,
      pages
    });
  } catch (error) {
    return send(res, 502, { error: error.message || 'Could not load analytics.' });
  }
};
