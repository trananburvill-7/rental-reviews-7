import Link from 'next/link'
import { createServerClient } from '@/lib/supabase'
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react'
import { getRatingBg } from '@/lib/utils'

interface SuburbLeaderboardProps {
  type: 'best' | 'worst'
}

export async function SuburbLeaderboard({ type }: SuburbLeaderboardProps) {
  const supabase = createServerClient()

  const { data: suburbs } = await supabase
    .from('suburb_stats')
    .select('*')
    .gt('review_count', 0)
    .order('avg_overall', { ascending: type === 'worst', nullsFirst: false })
    .limit(5)

  if (!suburbs?.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 text-center text-gray-400 text-sm">
        No suburb data available yet
      </div>
    )
  }

  const Icon = type === 'best' ? TrendingUp : TrendingDown

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {suburbs.map((suburb, index) => {
        const ratingBg = getRatingBg(suburb.avg_overall)
        return (
          <Link
            key={suburb.slug}
            href={`/suburb/${suburb.slug}`}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 group"
          >
            {/* Rank */}
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              index === 0
                ? type === 'best' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              {index + 1}
            </span>

            {/* Location */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                {suburb.suburb}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {suburb.state} · {suburb.review_count} review{suburb.review_count !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating */}
            {suburb.avg_overall && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ratingBg}`}>
                {suburb.avg_overall.toFixed(1)}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
