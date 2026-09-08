# Finish the private analytics dashboard

The editor now has an **Analytics** section at `/admin`. Vercel Web Analytics
collects the anonymous traffic, while a protected server function reads the
aggregated results for the editor.

## Add these Vercel environment variables

Open the portfolio project in Vercel, then go to **Settings → Environment
Variables**. Add each variable to Production, Preview, and Development.

### `VERCEL_ANALYTICS_TOKEN`

1. Open your Vercel avatar menu and choose **Account Settings**.
2. Open **Tokens** and create a token that can access this project.
3. Copy the token into this environment variable. Keep it private.

### `ANALYTICS_PROJECT_ID`

1. Open the portfolio project.
2. Go to **Settings → General**.
3. Copy **Project ID** and paste it into this environment variable.

### `ANALYTICS_TEAM_SLUG` (only if the project belongs to a team)

Use the team/account slug shown in the Vercel dashboard URL. If the API reports
that it cannot find or access the project, add this variable. You can use
`ANALYTICS_TEAM_ID` instead if you prefer the team ID from Team Settings.

## Redeploy and view it

After saving the variables, redeploy the latest production deployment. Then
open `/admin`, sign in, and select **Analytics** beneath the editable sections.

The Vercel token is read only by `/api/analytics`; it is never included in the
website HTML or returned to the browser. The endpoint also verifies that the
signed-in GitHub user is the repository owner before returning any statistics.
