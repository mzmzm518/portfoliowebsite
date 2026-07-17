# Turning on the /admin editor login (Vercel)

The site is hosted on **Vercel**, so the editor's "Login with GitHub" is handled
by two small functions already in this repo (`api/auth.js`, `api/callback.js`).
To switch it on you do two things once, in the browser. ~5 minutes. No coding.

Everything lives under **Mariam's** accounts (GitHub `mzmzm518`, her Vercel), so
once this works, nobody has to maintain it.

Your site URL (used below):
**https://portfoliowebsite-three-blue.vercel.app**

> If you later add a custom domain, use that domain everywhere below instead,
> and also change `base_url` in `admin/config.yml` to match.

---

## Step 1 — Register the login with GitHub (Mariam's GitHub)

1. Signed in to GitHub as **mzmzm518**, go to
   **https://github.com/settings/developers**
2. **OAuth Apps** → **New OAuth App**. Fill in:
   - **Application name:** `Portfolio editor`
   - **Homepage URL:**
     `https://portfoliowebsite-three-blue.vercel.app`
   - **Authorization callback URL:**  *(type it exactly)*
     `https://portfoliowebsite-three-blue.vercel.app/api/callback`
3. **Register application.** You'll now see a **Client ID** — keep this tab open.
4. Click **Generate a new client secret** and copy the **Client secret**
   immediately (GitHub only shows it once).

You now have two values: a **Client ID** and a **Client secret**.

---

## Step 2 — Give those two keys to Vercel

1. Go to **vercel.com** → open the **portfoliowebsite** project.
2. **Settings** → **Environment Variables**.
3. Add two variables (Name must match exactly, all caps):

   | Name                   | Value                        |
   |------------------------|------------------------------|
   | `GITHUB_CLIENT_ID`     | the Client ID from Step 1    |
   | `GITHUB_CLIENT_SECRET` | the Client secret from Step 1|

   Leave them applied to all environments (Production/Preview/Development).
4. **Save.** Then redeploy so the keys take effect:
   **Deployments** → the top one → **⋯** → **Redeploy**.

---

## Step 3 — Test it

1. Go to **https://portfoliowebsite-three-blue.vercel.app/admin/**
2. Click **Login with GitHub** → a popup asks you to approve → approve once.
3. You should land in the editor (**Portfolio → Records & Tracklists**).
   Change a word, click **Save/Publish**. Within a minute the live site updates.

If login works and an edit shows up on the site, **the editor is fully on.**

---

## If something's off

- **"Setup needed: add GITHUB_CLIENT_ID…"** — the env vars aren't set yet, or you
  didn't redeploy after adding them. Redo Step 2 and redeploy.
- **Popup says "Login failed"** — the callback URL in the GitHub OAuth App
  (Step 1) doesn't exactly match `https://<your-site>/api/callback`. Fix and retry.
- **Login works but saving fails** — confirm `admin/config.yml` `repo:` is
  `mzmzm518/portfoliowebsite` and the GitHub account you log in with can write
  to that repo (Mariam's own account can).

---

## How Mariam edits, day to day

1. Go to **your-site.com/admin/** → **Login with GitHub**.
2. **Records & Tracklists** → pick a section (About, Copywriting, Visual Work,
   Sound, Film) → change text, drag in photos/PDFs/video, or paste links.
3. **Save/Publish.** The live site updates within a minute. Every save is kept in
   GitHub history, so nothing can be permanently broken.
