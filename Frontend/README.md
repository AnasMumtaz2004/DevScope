# DevScope

A GitHub profile analytics dashboard. Type any public GitHub username and it pulls real data from the GitHub API — no login, no account needed.

Built with React, Tailwind CSS, and a small Express backend that keeps the GitHub token off the browser.

Live at https://dev-scope-two.vercel.app


## What it shows

The contribution heatmap is the main thing. It uses GitHub's GraphQL API to pull your full contribution calendar — the same data GitHub shows on your profile, with the same four shades of green. Every square is a real day, every shade is a real commit count.

Below that: top repositories sorted by stars, recent commit messages linked directly to each repo, a language breakdown built from your actual repos, and four stat cards showing recent commits, public repos, followers, and current push streak. None of it is cached — every search hits the API fresh.


## Tech stack

Frontend is React 19 with Tailwind CSS v4, built with Vite 7. No component library, no UI kit — everything is written from scratch. The contribution heatmap, skeleton loaders, tooltip on hover, dark mode toggle, and responsive layout are all hand-rolled.

Backend is a small Express server with one real route: POST /api/contributions/:username. It takes the username, calls GitHub's GraphQL API using a server-side token, and returns the contribution calendar. The token never touches the browser.




    DEVSCOPE/
    Backend/
        server.js
        package.json
        .env
        .gitignore
    Frontend/
        src/
            components/
                HeatMap.jsx
                LanguageBar.jsx
                StatCard.jsx
                Skeleton.jsx
            hooks/
                useGitHub.js
            App.jsx
            index.css
            main.jsx
        index.html
        vite.config.js
        package.json
        .env
        .gitignore


## Running it locally

You need Node 20.19 or higher. Check with node -v before starting.

Get a GitHub personal access token at github.com/settings/tokens. Use a classic token with no scopes — just generate it with all checkboxes unticked. This is what the backend uses to call the GraphQL API.

Open Backend/.env and replace your_github_token_here with the token you just copied.

Then in two separate terminals:

Terminal one, for the backend:

    cd Backend
    npm install
    npm run dev

Terminal two, for the frontend:

    cd Frontend
    npm install
    npm run dev

Open http://localhost:5173 and search any GitHub username. AnasMumtaz2004 is a good one to start with.


## Deploying

Backend goes on Render. Push the Backend folder to a GitHub repo, create a new Web Service on Render, set the build command to npm install and the start command to npm start. Add two environment variables in Render's dashboard: GITHUB_TOKEN with your token, and CLIENT_URL with your Vercel frontend URL once you have it.

Frontend goes on Vercel. Push the Frontend folder to a separate GitHub repo, connect it to Vercel, and it will detect Vite automatically. Add one environment variable: VITE_API_URL set to your Render backend URL, for example https://devscope-api.onrender.com.

After both are deployed, update CLIENT_URL in Render to match your actual Vercel URL. That is the CORS setting — if it is wrong, the browser will block requests from the frontend to the backend.


## Environment variables

Backend/.env

    GITHUB_TOKEN : your GitHub personal access token
    CLIENT_URL : the frontend URL allowed to talk to this server

Frontend/.env

    VITE_API_URL      the backend server URL

## A note on the data

Recent commits and current streak are calculated from the last 100 public events the GitHub API returns. This means the numbers reflect recent activity, not a full career total. The contribution heatmap comes from GraphQL and covers the full past year — that data is accurate.

If a user has no push events in their last 100 public events, commits will show 0 and streak will show 0. That is expected — the events API only goes back so far.


## Author

Anas Mumtaz
github.com/AnasMumtaz2004