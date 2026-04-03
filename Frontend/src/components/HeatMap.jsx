import React from 'react'
import { useState } from 'react'

const COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
const EMPTY_DARK = '#161b22'

const Legend = () => (
  <div className="flex items-center gap-1.5 mt-2.5">
    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Less</span>
    {COLORS.map((color, i) => (
      <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
    ))}
    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">More</span>
  </div>
)

// loading skeleton
export const HeatMapSkeleton = () => (
  <div>
    <div className="grid gap-0.75" style={{ gridTemplateColumns: 'repeat(26, 1fr)' }}>
      {Array.from({ length: 182 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-sm bg-zinc-200 dark:bg-zinc-700"/>
      ))}
    </div>
    <Legend />
  </div>
)

// heatmap — receives `dark` prop from App so it re-renders on toggle
const HeatMap = ({ days, dark }) => {
  const [tooltip, setTooltip] = useState(null)

  if (!days) return <HeatMapSkeleton />

  return (
    <div className="relative">
      <div className="grid gap-0.75" style={{ gridTemplateColumns: 'repeat(26, 1fr)' }}>
        {days.map(({ key, level, count }) => (
          <div key={key} className="aspect-square rounded-sm cursor-default" style={{
              background: level === 0 && dark ? EMPTY_DARK : COLORS[level],
            }}
            onMouseEnter={() => setTooltip({ key, count })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>

      {tooltip && (
        <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-1 rounded">
          {new Date(tooltip.key).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}{' '}
          —{' '}
          {tooltip.count === 0
            ? 'no commits'
            : `${tooltip.count} commit${tooltip.count === 1 ? '' : 's'}`}
        </div>
      )}

      <Legend />
    </div>
  )
}

export default HeatMap