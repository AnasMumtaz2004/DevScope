import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'DevScope backend' })
})

app.get('/api/contributions/:username', async (req, res) => {
  const { username } = req.params
  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({
      error: 'GITHUB_TOKEN is not set in Backend/.env'
    })
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
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
    if (!json.data?.user) {
      return res.status(404).json({
        error: `GitHub user "${username}" not found`
      })
    }

    const calendar =
      json.data.user.contributionsCollection.contributionCalendar

    res.json(calendar)

  } catch (err) {
    console.error('GitHub GraphQL error:', err.message)
    res.status(500).json({ error: 'Failed to fetch from GitHub' })
  }
})

app.listen(PORT, () => {
  console.log(`DevScope backend running on http://localhost:${PORT}`)
})