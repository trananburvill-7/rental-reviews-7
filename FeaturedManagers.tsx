import Link from 'next/link'
import { createServerClient } from '@/lib/supabase'
import { StarRating } from '@/components/ui/StarRating'
import { Users, Building2 } from 'lucide-react'

export async function FeaturedManagers() {
  const supabase = createServerClient()

  const { data: managers } = await supabase
    .from('manager_stats')
    .select('*')
    .gt('review_count', 0)
    .order('avg_overall', { ascending: false, nullsFirst: false })
    .limit(8)

  if (!managers?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No manager reviews yet. Share your experience!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {managers.map((manager) => (
        <ManagerCard key={manager.id} manager={manager} />
      ))}
    </div>
  )
}

function ManagerCard({ manager }: { manager: any }) {
  const initials = manager.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Link href={`/manager/${manager.slug}`} className="manager-card group block p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {manager.photo_url ? (
            <img
              src={manager.photo_url}
              alt={manager.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-brand-600 transition-colors">
            {manager.name}
          </h3>
          {manager.agency && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{manager.agency}</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={manager.avg_overall} size="xs" showNumber />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {manager.review_count} review{manager.review_count !== 1 ? 's' : ''}
        </span>
        {manager.managed_property_count > 0 && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {manager.managed_property_count} propert{manager.managed_property_count !== 1 ? 'ies' : 'y'}
          </span>
        )}
      </div>
    </Link>
  )
}
