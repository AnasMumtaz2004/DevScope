import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN

function ghFetch(url) {
  const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
  return fetch(url, { headers })
}

async function fetchContributionGraph(username) {
  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const res = await fetch(`${BASE}/api/contributions/${username}`)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to fetch contribution graph')
  }

  return res.json()
}

export function useGitHub(username) {
  const [data, setData]= useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return

    async function fetchAll() {
      setLoading(true)
      setError(null)
      setData(null)
      try {
        const [userRes, reposRes, calendar, eventsRes] = await Promise.all([
          ghFetch(`https://api.github.com/users/${username}`),
          ghFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
          fetchContributionGraph(username),
          ghFetch(`https://api.github.com/users/${username}/events/public?per_page=100`)
        ])

        if (!userRes.ok) {
          throw new Error(
            userRes.status === 404
              ? `"${username}" not found`
              : `GitHub error (${userRes.status})`
          )
        }

        const user = await userRes.json()
        const repos = await reposRes.json()
        const events = await eventsRes.json()

        console.log("EVENTS:", events)

        setData({
          user,
          stats: buildStats(user, repos, events, calendar),
          langs: buildLanguages(repos),
          topRepos: buildTopRepos(repos),
          commits: buildRecentActivity(events),
          heatmap: buildHeatmapFromGraphQL(calendar),
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

function buildHeatmapFromGraphQL(calendar) {
  const days = []

  calendar.weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      const n = day.contributionCount

      let level = 0
      if (n >= 1) level = 1
      if (n >= 3) level = 2
      if (n >= 6) level = 3
      if (n >= 10) level = 4

      days.push({
        key: day.date,
        count: n,
        level,
      })
    })
  })

  return days.slice(-182)
}

function buildRecentActivity(events) {
  return events
    .map(e => ({
      message: e.type.replace('Event', ''),
      repo: e.repo?.name?.split('/')[1] || 'unknown',
      date: e.created_at,
      url: `https://github.com/${e.repo?.name || ''}`,
    }))
    .slice(0, 6)
}

// ✅ helper for total commits (unchanged logic)
function getTotalCommitsFromCalendar(calendar) {
  return calendar.weeks.reduce((sum, week) => {
    return sum + week.contributionDays.reduce((wSum, day) => {
      return wSum + day.contributionCount
    }, 0)
  }, 0)
}

// ✅ NEW: local date fix (IMPORTANT)
function getLocalDateString(date) {
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD
}


function buildStats(user, repos, events, calendar) {
  const totalCommits = getTotalCommitsFromCalendar(calendar)
  const pushDays = new Set(
    calendar.weeks.flatMap(week =>
      week.contributionDays
        .filter(day => day.contributionCount > 0)
        .map(day => day.date)
    )
  )

  let streak = 0
  const current = new Date()

  while (true) {
    const key = getLocalDateString(current) // ✅ FIX HERE
    if (!pushDays.has(key)) break
    streak++
    current.setDate(current.getDate() - 1)
  }

  return {
    commits: totalCommits,
    repos: user.public_repos,
    followers: user.followers,
    streak,
  }
}

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

function buildTopRepos(repos) {
  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map(r => ({
      name: r.name,
      desc: r.description || 'No description',
      stars: r.stargazers_count,
      url: r.html_url,
      lang: r.language,
    }))
}