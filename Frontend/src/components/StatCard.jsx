import React from 'react'

export const StatCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
      <div className="skeleton h-2.5 w-16 rounded bg-zinc-200 dark:bg-zinc-700 mb-2" />
      <div className="skeleton h-6 w-12 rounded bg-zinc-200 dark:bg-zinc-700 mb-1.5" />
      <div className="skeleton h-2 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  )
}

const StatCard = ({ label, value, sub }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">{label}</p>
      <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
      {sub && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>
      )}
    </div>
  )
}

export default StatCard