# Going live + turning on Mariam's editor

This is the one-time setup that puts the site online **and** switches on the
`/admin` editing panel so Mariam can change text and upload her own work
without touching any code.

Everything is built to live under **Mariam's own accounts**, so once this is
done, Quinton can walk away and nothing needs maintaining. Hosting is **free**
(Netlify's free tier); the only optional cost is a custom domain (~$12/year).

There are two parts:

- **Part A — one-time setup** (Quinton or Mariam, ~30 minutes, done once)
- **Part B — how Mariam edits, forever after** (no code, just a web form)

---

## Part A — One-time setup

Do these in order. Where it says "her," use Mariam's own email/accounts so she
owns everything.

### 1. Make a GitHub account (this is where the files live)

1. Go to **github.com** and sign up with Mariam's email. Pick a username
   (e.g. `mariamlokhat`). Verify the email.
2. That's it for now. GitHub is just the storage box that holds the website
   files and remembers every edit.

### 2. Put the website files on GitHub

1. Signed in to GitHub, click the **+** (top right) → **New repository**.
2. Name it something like `portfolio`. Set it to **Public**. Click
   **Create repository**.
3. On the new repo page, click **uploading an existing file** (the link in the
   "Quick setup" box).
4. Drag in **everything in this project folder** — the whole thing:
   - `Vinyl Portfolio.dc.html`
   - `content.json`
   - `support.js`
   - the `admin/`, `images/`, and `vendor/` folders
   - (the `.md` notes can come along too; they don't affect the site)
5. Click **Commit changes**.

> Write down the repo as `username/portfolio` — e.g. `mariamlokhat/portfolio`.
> You'll need it in step 5.

### 3. Publish it with Netlify (free hosting)

1. Go to **netlify.com** → **Sign up** → choose **Sign up with GitHub** and use
   Mariam's GitHub. (Signing up with GitHub links the two automatically.)
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Authorize Netlify, then pick the `portfolio` repo.
4. Leave the build settings **blank** (there's no build step — it's a plain
   site). Just set:
   - **Publish directory:** leave empty / `.` (the root)
5. Click **Deploy**. In ~30 seconds you'll get a live URL like
   `https://something-random-1234.netlify.app`.
6. (Optional) **Site configuration → Change site name** to make it prettier,
   e.g. `mariam-lokhat.netlify.app`.

The public site is now live. But `/admin` won't be able to log in yet — that's
step 4.

### 4. Turn on the editor login

The `/admin` panel logs in **through GitHub** so only Mariam can save changes.
You connect them once:

**4a. Register the login with GitHub**

1. GitHub → click Mariam's avatar (top right) → **Settings**.
2. Left sidebar, scroll to the bottom → **Developer settings**.
3. **OAuth Apps** → **New OAuth App**. Fill in:
   - **Application name:** `Portfolio editor`
   - **Homepage URL:** the Netlify URL from step 3
     (e.g. `https://mariam-lokhat.netlify.app`)
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
     *(type it exactly — this is Netlify's, not the site's)*
4. **Register application.** You'll see a **Client ID**.
5. Click **Generate a new client secret**, and copy the **Client secret**
   right away (you can't see it again later).

**4b. Give those two keys to Netlify**

1. Netlify → your site → **Site configuration** → **Access & security** →
   **OAuth** (may read "Authentication providers" / "Install provider").
2. **Install provider** → choose **GitHub**.
3. Paste the **Client ID** and **Client secret** from step 4a. Save.

That's the whole login. Netlify now handles "sign in with GitHub" for the
editor — nothing to host or maintain.

### 5. Point the editor at the repo

One tiny text edit so the editor knows which files to save to:

1. In GitHub, open **`admin/config.yml`** → click the **pencil** ✏️ to edit.
2. Find this near the top:
   ```yaml
   repo: OWNER/REPO          # <-- Phase 2: e.g.  mariamlokhat/portfolio
   ```
   Change `OWNER/REPO` to the real repo from step 2, e.g.:
   ```yaml
   repo: mariamlokhat/portfolio
   ```
3. **Commit changes.** Netlify re-publishes automatically in ~30 seconds.

### 6. Test it

1. Go to `https://<her-site>.netlify.app/admin/`
2. Click **Login with GitHub**, approve once.
3. You should see **Portfolio → Records & Tracklists**. Open a record, change a
   word, click **Publish/Save**. Within a minute the live site updates.

If login works and an edit shows up on the site, **you're done** — hand it off.

### 7. (Optional) Custom domain

If Mariam wants `mariamlokhat.com` instead of the netlify.app address:

1. Buy the domain in **her name** (Namecheap, Cloudflare, Google Domains, etc.,
   ~$12/yr). Hosting stays free — the domain is the only cost.
2. Netlify → **Domain management** → **Add a domain** → follow the DNS steps it
   gives you (paste a couple of records at the domain registrar).
3. Netlify adds HTTPS automatically. The `/admin` login keeps working; if you
   want, update the OAuth App **Homepage URL** (step 4a) to the new domain.

---

## Part B — How Mariam edits the site (the everyday part)

No code, ever. Just a web form.

1. Go to **your-site.com/admin/** and **Login with GitHub**.
2. Click **Records & Tracklists**. Each "record" is one section of the site
   (About, Copywriting, Concepts, Sound, Film).
3. Click a record to edit it. You can:
   - **Change any text** — title, description, intro paragraphs, taglines.
   - **Edit the tracklist / projects** — add, remove, or reorder items.
   - **Upload a new image** — drag a file into the **Record image** box.
   - **Add a whole new record** — click **Add Record**, fill in the fields.
     Give it the next order code (`A6`, `A7`, …) so it lines up on the home
     screen.
4. Click **Publish** (or **Save**). The live site updates within a minute.

Tips:
- **Order code** (A1, A2…) controls the order records appear in on the home
  screen.
- The **Education / Certifications** fields at the bottom are only used by the
  **About** record — leave them blank on the others.
- Every save is remembered by GitHub, so nothing can be permanently broken —
  an earlier version can always be restored.

---

## Quick reference

| Thing | Where |
|---|---|
| Public site | `https://<her-site>.netlify.app` (or custom domain) |
| Editor panel | add `/admin/` to that URL |
| Files / history | github.com → her `portfolio` repo |
| Hosting dashboard | netlify.com |
| What she edits | `content.json` (via the editor — she never opens it directly) |

**Cost:** hosting $0. Domain optional (~$12/yr). Nothing to maintain.
