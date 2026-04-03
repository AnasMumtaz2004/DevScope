import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN


function ghFetch(url) {
  const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
  return fetch(url, { headers })
}

export function useGitHub(username) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!username) return

    async function fetchAll() {
      setLoading(true)
      setError(null)
      setData(null)

      try {
        // fetch data
        const [userRes, reposRes, eventsRes] = await Promise.all([
          ghFetch(`https://api.github.com/users/${username}`),
          ghFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
          ghFetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
        ])

        if (!userRes.ok) {
          throw new Error(
            userRes.status === 404
              ? `"${username}" not found`
              : `GitHub error (${userRes.status})`
          )
        }

        const user   = await userRes.json()
        const repos  = await reposRes.json()
        const events = await eventsRes.json()

        setData({
          user,
          stats:    buildStats(user, repos, events),
          langs:    buildLanguages(repos),
          topRepos: buildTopRepos(repos),
          commits:  buildRecentCommits(events),
          heatmap:  buildHeatmap(events),
        })

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [username])

  return { data, loading, error }
}

// build basic stats
function buildStats(user, repos, events) {
  const totalCommits = events
    .filter(e => e.type === 'PushEvent')
    .reduce((sum, e) => sum + (e.payload.commits?.length || 0), 0)

  const pushDays = new Set(
    events
      .filter(e => e.type === 'PushEvent')
      .map(e => e.created_at.slice(0, 10))
  )

  let streak = 0
  const day = new Date()
  while (true) {
    const key = day.toISOString().slice(0, 10)
    if (!pushDays.has(key)) break
    streak++
    day.setDate(day.getDate() - 1)
  }

  return {
    commits:   totalCommits,
    repos:     user.public_repos,
    followers: user.followers,
    streak,
  }
}

// top languages 
function buildLanguages(repos) {
  const counts = {}

  repos.forEach(r => {
    if (r.language) {
      counts[r.language] = (counts[r.language] || 0) + 1
    }
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      pct: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)
}

// top starred repos 
function buildTopRepos(repos) {
  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map(r => ({
      name:  r.name,
      desc:  r.description || 'No description',
      stars: r.stargazers_count,
      url:   r.html_url,
      lang:  r.language,
    }))
}

// recent commits 
function buildRecentCommits(events) {
  return events
    .filter(e => e.type === 'PushEvent')
    .flatMap(e =>
      (e.payload.commits || []).map(c => ({
        message: c.message.split('\n')[0],
        repo:    e.repo.name.split('/')[1],
        date:    e.created_at,
        url:     `https://github.com/${e.repo.name}`,
      }))
    )
    .slice(0, 6)
}

// contribution heatmap 
function buildHeatmap(events) {
  const countByDay = {}

  events
    .filter(e => e.type === 'PushEvent')
    .forEach(e => {
      const day = e.created_at.slice(0, 10)
      const n   = e.payload.commits?.length || 0
      countByDay[day] = (countByDay[day] || 0) + n
    })

  const days  = []
  const today = new Date()

  for (let i = 181; i >= 0; i--) {
    const d   = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const n   = countByDay[key] || 0

    let level = 0
    if (n >= 1)  level = 1
    if (n >= 3)  level = 2
    if (n >= 6)  level = 3
    if (n >= 10) level = 4

    days.push({ key, level, count: n })
  }

  return days
}