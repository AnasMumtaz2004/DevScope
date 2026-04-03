import { useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function apiFetch(path) {
    const res = await fetch(`${BASE_URL}${path}`)
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Failed to fetch ${path}`)
    }
    return res.json()
}

export function useGitHub(username) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!username) return

        async function fetchAll() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const [user, repos, calendar, events] = await Promise.all([
                    apiFetch(`/api/user/${username}`),
                    apiFetch(`/api/repos/${username}`),
                    apiFetch(`/api/contributions/${username}`),
                    apiFetch(`/api/events/${username}`),
                ])

                console.log("EVENTS:", events)

                setData({
                    user,
                    stats:    buildStats(user, repos, events),
                    langs:    buildLanguages(repos),
                    topRepos: buildTopRepos(repos),
                    commits:  buildRecentActivity(events),
                    heatmap:  buildHeatmapFromGraphQL(calendar),
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
            if (n >= 1)  level = 1
            if (n >= 3)  level = 2
            if (n >= 6)  level = 3
            if (n >= 10) level = 4
            days.push({ key: day.date, count: n, level })
        })
    })
    return days.slice(-182)
}

function buildRecentActivity(events) {
    return events
        .filter(e => e.type === 'PushEvent')
        .flatMap(e =>
            (e.payload?.commits || []).map(commit => ({
                message: commit.message,
                repo:    e.repo?.name?.split('/')[1] || 'unknown',
                date:    e.created_at,
                url:     `https://github.com/${e.repo?.name || ''}`,
            }))
        )
        .slice(0, 6)
}

function buildStats(user, repos, events) {
    const commitCount = events
        .filter(e => e.type === 'PushEvent')
        .reduce((acc, e) => acc + (e.payload?.commits?.length || 0), 0)

    return {
        commits:   commitCount,
        repos:     user.public_repos,
        followers: user.followers,
        streak:    '—',
    }
}

function buildLanguages(repos) {
    const counts = {}
    repos.forEach(r => {
        if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return Object.entries(counts)
        .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 5)
}

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