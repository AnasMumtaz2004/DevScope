import { useState } from 'react'
import { useGitHub } from './hooks/useGitHub'

import StatCard from './components/StatCard'
import HeatMap from './components/HeatMap'
import LanguageBar from './components/LanguageBar'

import { StatCardSkeleton } from './components/StatCard'
import { HeatMapSkeleton } from './components/HeatMap'
import { LanguageBarSkeleton } from './components/LanguageBar'

const App = () => {

  const [input, setInput] = useState('')
  const [username, setUsername] = useState('')
  const [dark, setDark] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setUsername(trimmed)
  }

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  const { data, loading, error } = useGitHub(username)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">

            {/* logo */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                fill="none"
                className="w-5 h-5 mt-px"
             >
                {/* Outer D shape */}
                <path
                  d="M16 8 H32 A20 20 0 0 1 32 56 H16 Z"
                  stroke="#216e39"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Nodes */}
                <circle cx="20" cy="16" r="3.8" fill="#216e39" />
                <circle cx="44" cy="32" r="3.8" fill="#216e39" />
                <circle cx="20" cy="48" r="3.8" fill="#216e39" />

                {/* Branch lines */}
                <path
                  d="M20 16 V48"
                  stroke="#216e39"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                <path
                  d="M20 32 C20 32, 32 32, 44 32"
                  stroke="#216e39"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-['Silkscreen'] text-2xl text-zinc-900 dark:text-zinc-100 tracking-wide">
                DEVSCOPE
              </span>
            </div>

            {/* dark mode toggle */}
            <button
              onClick={toggleDark}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {dark ? '☀ Light' : '☽ Dark'}
            </button>
          </div>

          {/* search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a GitHub username..."
              className="flex-1 text-sm px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              className="text-xs px-4 py-2 rounded-lg shrink-0 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:opacity-80 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>

        {/* empty state */}
        {!username && !loading && (
          <div className="text-center py-24 text-zinc-400 dark:text-zinc-600 text-sm">
            Type any GitHub username and press Search
          </div>
        )}

        {/* error */}
        {error && !loading && (
          <div className="text-center py-24 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-3">

            {/* fake profile */}
            <div className="flex items-center gap-3 mb-1">
              <div className="skeleton w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex flex-col gap-1.5">
                <div className="skeleton h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="skeleton h-2.5 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>

            {/* fake stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>

            {/* fake heatmap + languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <div className="skeleton h-2.5 w-48 rounded bg-zinc-200 dark:bg-zinc-700 mb-3" />
                <HeatMapSkeleton />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <div className="skeleton h-2.5 w-24 rounded bg-zinc-200 dark:bg-zinc-700 mb-3" />
                <LanguageBarSkeleton />
              </div>
            </div>

            {/* fake repos + commits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[0, 1].map(i => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="skeleton h-2.5 w-28 rounded bg-zinc-200 dark:bg-zinc-700 mb-3" />
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="flex gap-2 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      <div className="skeleton h-2.5 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* real data */}
        {data && !loading && (
          <div className="flex flex-col gap-3">

            {/* profile */}
            <div className="flex items-center gap-3 mb-1">
              <img
                src={data.user.avatar_url}
                alt={username}
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800"
              />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {data.user.name || username}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600">
                  {data.user.bio || 'No bio'}
                </p>
              </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <StatCard label="Recent commits" value={data.stats.commits} sub="last 100 events" />
              <StatCard label="Public repos" value={data.stats.repos} sub="excluding forks" />
              <StatCard label="Followers" value={data.stats.followers} sub="on GitHub" />
              <StatCard label="Current streak" value={`${data.stats.streak}d`} sub="consecutive days" />
            </div>

            {/* heatmap + languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3 tracking-wide">
                  Contribution activity — last 6 months
                </p>
                <HeatMap days={data.heatmap} />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3 tracking-wide">
                  Languages
                </p>
                <LanguageBar langs={data.langs} />
              </div>
            </div>

            {/* top repos + recent commits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">

              {/* top repos */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3 tracking-wide">
                  Top repositories
                </p>
                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data.topRepos.map(repo => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between py-2.5 hover:opacity-70 transition-opacity"
                    >
                      <div className="min-w-0 mr-3">
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          {repo.name}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 truncate">
                          {repo.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#216e39] shrink-0">
                        <span>★</span>
                        <span>{repo.stars}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* recent commits */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3 tracking-wide">
                  Recent commits
                </p>
                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data.commits.map((c, i) => (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-2.5 py-2.5 hover:opacity-70 transition-opacity"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9be9a8] mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug line-clamp-1">
                          {c.message}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                          {new Date(c.date).toLocaleDateString()} · {c.repo}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App