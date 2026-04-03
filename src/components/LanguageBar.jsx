import React from 'react'

export const LanguageBarSkeleton = () => {
  return (
    <div className="flex flex-col gap-2.5">
      {[72, 50, 35, 15].map((w, i) => (
        <div key={i} className="flex items-center gap-2">

          <div className="h-2.5 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />          
          <div className="flex-1 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-300 dark:bg-zinc-600"
              style={{ width: `${w}%` }}
            />
          </div>
          <div className="h-2.5 w-6 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  )
}

// main component
const LanguageBar = ({ langs }) => {

  if (!langs || langs.length === 0) {
    return (
      <p className="text-xs text-zinc-400 dark:text-zinc-600">No language data available </p>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {langs.map(({ name, pct }) => (
        <div key={name} className="flex items-center gap-2">
          <span className="w-20 text-xs text-zinc-500 dark:text-zinc-400 truncate shrink-0"> {name} </span>
          <div className="flex-1 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full rounded-full bg-[#216e39] opacity-70" style={{ width: `${pct}%` }}/>
          </div>
          <span className="w-7 text-right text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            {pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default LanguageBar