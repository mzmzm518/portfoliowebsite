// ---------------------------------------------------------------------------
//  Step 2 of the editor login: finish signing in.
//
//  GitHub sends Mariam back here with a one-time code. We swap that code for an
//  access token, then hand the token back to the /admin editor so it can save
//  her changes straight to this repo. The popup window closes itself.
//
//  Needs two Vercel environment variables:
//    GITHUB_CLIENT_ID     and     GITHUB_CLIENT_SECRET
//  (set them in Vercel → Settings → Environment Variables — see EDITOR-LOGIN-VERCEL.md)
// ---------------------------------------------------------------------------
module.exports = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.statusCode = 500;
      res.end('Setup needed: add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel → Settings → Environment Variables.');
      return;
    }

    const host = req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = new URL(req.url, `${proto}://${host}`);
    const code = url.searchParams.get('code');
    if (!code) {
      res.statusCode = 400;
      res.end('Missing authorization code from GitHub.');
      return;
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${proto}://${host}/api/callback`,
      }),
    });
    const data = await tokenRes.json();

    let status, content;
    if (data.access_token) {
      status = 'success';
      content = { token: data.access_token, provider: 'github' };
    } else {
      status = 'error';
      content = { message: data.error_description || data.error || 'Could not get a token from GitHub.' };
    }

    // Hand the result back to the editor window that opened this popup,
    // using the message format Sveltia/Decap CMS expects, then let it close.
    const payload = 'authorization:github:' + status + ':' + JSON.stringify(content);
    const body =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Signing in…</title><script>' +
      '(function(){' +
      'function receiveMessage(e){' +
      'window.opener.postMessage(' + JSON.stringify(payload) + ', e.origin);' +
      'window.removeEventListener("message", receiveMessage, false);' +
      '}' +
      'window.addEventListener("message", receiveMessage, false);' +
      'window.opener.postMessage("authorizing:github", "*");' +
      '})();' +
      '</script></head><body>' +
      (status === 'success'
        ? 'Login complete — you can close this window.'
        : 'Login failed: ' + content.message) +
      '</body></html>';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.end('Login error: ' + err.message);
  }
};
