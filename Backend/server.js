import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const GH_HEADERS = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
}

app.use(cors({
    origin: (origin, callback) => {
        const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
        const requestOrigin = (origin || '').replace(/\/$/, '')
        if (!origin || requestOrigin === allowed) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DevScope backend is running' })
})

// User info
app.get('/api/user/:username', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.username}`, {
            headers: GH_HEADERS
        })
        if (!response.ok) return res.status(response.status).json({ error: 'User not found' })
        res.json(await response.json())
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' })
    }
})

// Repos
app.get('/api/repos/:username', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.username}/repos?per_page=100&sort=pushed`, {
            headers: GH_HEADERS
        })
        if (!response.ok) return res.status(response.status).json({ error: 'Failed to fetch repos' })
        res.json(await response.json())
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch repos' })
    }
})

// Events
app.get('/api/events/:username', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.username}/events/public?per_page=100`, {
            headers: GH_HEADERS
        })
        if (!response.ok) return res.status(response.status).json({ error: 'Failed to fetch events' })
        res.json(await response.json())
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' })
    }
})

// Contribution graph
app.get('/api/contributions/:username', async (req, res) => {
    const { username } = req.params

    if (!process.env.GITHUB_TOKEN) {
        return res.status(500).json({ error: 'GITHUB_TOKEN is not set' })
    }

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: GH_HEADERS,
            body: JSON.stringify({
                query: `
                    query($login: String!) {
                        user(login: $login) {
                            contributionsCollection {
                                contributionCalendar {
                                    weeks {
                                        contributionDays {
                                            date
                                            contributionCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: { login: username },
            }),
        })

        const json = await response.json()
        if (!json.data || !json.data.user) {
            return res.status(404).json({ error: `GitHub user "${username}" not found` })
        }

        res.json(json.data.user.contributionsCollection.contributionCalendar)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contributions from GitHub' })
    }
})

app.listen(PORT, () => {
    console.log(`DevScope backend running on port ${PORT}`)
})