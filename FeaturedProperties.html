import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase'
import { StarRating } from '@/components/ui/StarRating'
import { getRatingBg, formatDateRelative } from '@/lib/utils'
import { Bed, Bath, Car, MapPin } from 'lucide-react'
import { PROPERTY_TYPE_LABELS } from '@/types'

interface FeaturedPropertiesProps {
  type: 'recent' | 'top_rated' | 'most_reviewed'
}

export async function FeaturedProperties({ type }: FeaturedPropertiesProps) {
  const supabase = createServerClient()

  const orderBy =
    type === 'recent' ? { column: 'created_at', ascending: false } :
    type === 'top_rated' ? { column: 'avg_overall', ascending: false } :
    { column: 'review_count', ascending: false }

  const { data: properties } = await supabase
    .from('property_stats')
    .select('*')
    .order(orderBy.column, { ascending: orderBy.ascending, nullsFirst: false })
    .limit(8)

  if (!properties?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No properties found yet. Be the first to add one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

function PropertyCard({ property }: { property: any }) {
  const ratingBg = getRatingBg(property.avg_overall)

  return (
    <Link href={`/property/${property.slug}`} className="property-card group block">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-brand-300 dark:text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 22V12h6v10" />
          </svg>
        </div>

        {/* Rating badge */}
        {property.avg_overall && (
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${ratingBg}`}>
            ★ {property.avg_overall.toFixed(1)}
          </div>
        )}

        {/* Property type badge */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
          {PROPERTY_TYPE_LABELS[property.property_type as keyof typeof PROPERTY_TYPE_LABELS] || property.property_type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-brand-600 transition-colors">
          {property.address}
        </h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 mb-2.5">
          <MapPin className="w-3 h-3" />
          {property.suburb}, {property.state} {property.postcode}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" /> {property.bathrooms}
            </span>
          )}
          {property.car_spaces != null && (
            <span className="flex items-center gap-1">
              <Car className="w-3 h-3" /> {property.car_spaces}
            </span>
          )}
        </div>

        {/* Stars + count */}
        <div className="flex items-center justify-between">
          <StarRating rating={property.avg_overall} size="xs" />
          <span className="text-xs text-gray-400">
            {property.review_count === 0
              ? 'No reviews'
              : `${property.review_count} review${property.review_count !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
    </Link>
  )
}
