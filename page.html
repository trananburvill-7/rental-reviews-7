import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { FeaturedProperties } from '@/components/cards/FeaturedProperties'
import { FeaturedManagers } from '@/components/cards/FeaturedManagers'
import { SuburbLeaderboard } from '@/components/cards/SuburbLeaderboard'
import { HowItWorks } from '@/components/layout/HowItWorks'
import { PlatformStats } from '@/components/layout/PlatformStats'
import { ReviewDisclaimer } from '@/components/layout/ReviewDisclaimer'
import { createServerClient } from '@/lib/supabase'

async function getHomeStats() {
  const supabase = createServerClient()

  const [properties, reviews, managers] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('property_reviews').select('id', { count: 'exact', head: true }).eq('moderation_status', 'approved'),
    supabase.from('property_managers').select('id', { count: 'exact', head: true }),
  ])

  return {
    properties: properties.count ?? 0,
    reviews: reviews.count ?? 0,
    managers: managers.count ?? 0,
  }
}

export default async function HomePage() {
  const stats = await getHomeStats()

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient hero-pattern relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Australia's rental transparency platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-5 text-balance">
              Find out what it's really like<br className="hidden sm:block" /> to rent a property
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto text-balance">
              Read and share honest, anonymous reviews of rental properties and property managers across Australia.
            </p>
          </div>

          <HeroSearch />

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Anonymous reviews
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Moderated for quality
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              No account required
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48h1440V24C1200 8 960 0 720 0S240 8 0 24v24z" fill="white" className="dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* Platform Stats */}
      <PlatformStats stats={stats} />

      {/* Review Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ReviewDisclaimer />
      </div>

      {/* Recently Reviewed / Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">Recently Reviewed</h2>
            <p className="section-subtitle text-sm mt-1">Properties with the latest tenant feedback</p>
          </div>
          <a href="/search?type=property&sort=newest_review" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </a>
        </div>
        <Suspense fallback={<PropertyCardSkeleton count={4} />}>
          <FeaturedProperties type="recent" />
        </Suspense>
      </section>

      {/* Highest Rated Properties */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">Highest Rated Properties</h2>
              <p className="section-subtitle text-sm mt-1">Top-rated rentals based on tenant reviews</p>
            </div>
            <a href="/search?type=property&sort=highest_rated" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </a>
          </div>
          <Suspense fallback={<PropertyCardSkeleton count={4} />}>
            <FeaturedProperties type="top_rated" />
          </Suspense>
        </div>
      </section>

      {/* Suburb Leaderboards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Best Rated Suburbs 🏆
                </h2>
                <p className="section-subtitle text-sm mt-1">Highest average tenant ratings</p>
              </div>
            </div>
            <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
              <SuburbLeaderboard type="best" />
            </Suspense>
          </div>
          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Worst Rated Suburbs ⚠️
                </h2>
                <p className="section-subtitle text-sm mt-1">Suburbs with lowest tenant satisfaction</p>
              </div>
            </div>
            <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
              <SuburbLeaderboard type="worst" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Top Property Managers */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">Top Property Managers</h2>
              <p className="section-subtitle text-sm mt-1">Highest rated by tenants across Australia</p>
            </div>
            <a href="/search?type=manager&sort=highest_rated" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </a>
          </div>
          <Suspense fallback={<ManagerCardSkeleton count={4} />}>
            <FeaturedManagers />
          </Suspense>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />
    </>
  )
}

function PropertyCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-100 dark:bg-gray-800" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ManagerCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}
