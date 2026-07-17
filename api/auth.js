// ---------------------------------------------------------------------------
//  Step 1 of the editor login: send Mariam to GitHub to sign in.
//
//  When she clicks "Login with GitHub" in /admin, Sveltia opens this endpoint.
//  We bounce her to GitHub's sign-in page. After she approves, GitHub sends
//  her back to /api/callback (the next file), which finishes the login.
//
//  Needs one Vercel environment variable: GITHUB_CLIENT_ID
//  (set it in Vercel → Settings → Environment Variables — see EDITOR-LOGIN-VERCEL.md)
// ---------------------------------------------------------------------------
const { randomBytes } = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end('Setup needed: add GITHUB_CLIENT_ID in Vercel → Settings → Environment Variables.');
    return;
  }

  const host = req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;
  const state = randomBytes(12).toString('hex');

  // public_repo = permission to save edits to this public repository only.
  const authUrl =
    'https://github.com/login/oauth/authorize' +
    '?client_id=' + encodeURIComponent(clientId) +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&scope=' + encodeURIComponent('public_repo') +
    '&state=' + state;

  res.writeHead(302, { Location: authUrl });
  res.end();
};
