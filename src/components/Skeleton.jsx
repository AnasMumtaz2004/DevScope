import React from 'react'

// repo list skeleton 

export const RepoSkeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center justify-between py-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-28 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3 w-44 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          </div>
          <div className="h-3 w-6 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse ml-3" />
        </div>
      ))}
    </div>
  )
}

// commit list skeleton (
export const CommitSkeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-start gap-2.5 py-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-1.5 shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3 w-28 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          </div>

        </div>
      ))}
    </div>
  )
}