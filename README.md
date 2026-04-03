# DevScope

A GitHub profile analytics dashboard built with React. Search any public GitHub username and get a live breakdown of their activity, repos, language usage, and contribution history. No backend, no database. Just the GitHub REST API called directly from the browser.

I built this because I wanted a single place to quickly profile any GitHub user without clicking through their profile page. Everything is derived from public data so it works on any account without any login or OAuth flow.

---

## What it does

- Fetches user profile, public repos, and the last 100 public events from the GitHub API in parallel
- Displays commit count, repo count, follower count, and current push streak as stat cards
- Renders a 6-month contribution heatmap with hover tooltips showing exact commit count per day
- Lists top repositories sorted by star count, forks excluded
- Shows recent commit messages with repo name, date, and a direct link to the repo
- Breaks down the top 5 languages across repos with percentage bars
- Full skeleton loading UI while data is in flight so the layout never jumps
- Light and dark mode toggle, dark class applied on the html element, Tailwind handles the rest

---

## Tech stack

- React 18 with hooks
- Tailwind CSS v4
- Vite
- GitHub REST API v3
- Silkscreen font for the wordmark

---

## Getting started

Requires Node.js 18 or above.

```
git clone https://github.com/your-username/devscope
cd devscope
npm install
npm run dev
```

Open http://localhost:5173 and search any GitHub username.

---

## GitHub token setup

The app works out of the box without any configuration. Unauthenticated GitHub API requests are limited to 60 per hour per IP. If you are testing heavily you will hit that fast.

Create a .env file in the project root:

```
VITE_GITHUB_TOKEN=your_personal_access_token
```

---

## Deployment

It is a fully static site. Run npm run dev locally or deploy the dist folder to Vercel, Netlify, or GitHub Pages. No server needed.

If you are deploying and want the token out of your codebase, set VITE_GITHUB_TOKEN as an environment variable in your hosting provider's dashboard instead of committing the .env file.

---

## Known limitations

The GitHub public events API only returns the last 100 events regardless of pagination. The commit count and heatmap reflect recent activity only, not the full account history. GitHub does not expose a total commit count through the REST API without iterating every repo individually which is too many requests for a client-side app.

The streak counter only tracks push events. It resets if there is no push on a given day even if the user made contributions through pull requests or reviews. This is intentional to keep it consistent with what the heatmap shows.

---

## Author

Anas Mumtaz