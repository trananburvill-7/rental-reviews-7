'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, Users, MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Suggestion {
  type: 'property' | 'manager' | 'suburb'
  id: string
  title: string
  subtitle: string
  slug: string
  rating?: number
}

type SearchMode = 'all' | 'property' | 'manager' | 'suburb'

const modes = [
  { key: 'all' as SearchMode, label: 'All' },
  { key: 'property' as SearchMode, label: 'Properties', icon: Building2 },
  { key: 'manager' as SearchMode, label: 'Managers', icon: Users },
  { key: 'suburb' as SearchMode, label: 'Suburbs', icon: MapPin },
]

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<SearchMode>('all')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const fetchSuggestions = useCallback(async (q: string, m: SearchMode) => {
    if (q.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams({ q, limit: '6' })
      if (m !== 'all') params.set('type', m)

      const res = await fetch(`/api/search/suggestions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.results ?? [])
        setIsOpen(true)
      }
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(query, mode), 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, mode, fetchSuggestions])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const params = new URLSearchParams({ q: query })
      if (mode !== 'all') params.set('type', mode)
      router.push(`/search?${params}`)
      setIsOpen(false)
    }
  }

  const handleSelect = (suggestion: Suggestion) => {
    const path =
      suggestion.type === 'property' ? `/property/${suggestion.slug}` :
      suggestion.type === 'manager' ? `/manager/${suggestion.slug}` :
      `/suburb/${suggestion.slug}`
    router.push(path)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !suggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const typeIcon = {
    property: <Building2 className="w-4 h-4 text-brand-500" />,
    manager: <Users className="w-4 h-4 text-purple-500" />,
    suburb: <MapPin className="w-4 h-4 text-green-500" />,
  }

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {/* Mode selector */}
      <div className="flex gap-1 mb-3 justify-center">
        {modes.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              mode === m.key
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
            <div className="pl-4 text-gray-400">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder={
                mode === 'property' ? 'Search by address, suburb, or postcode...' :
                mode === 'manager' ? 'Search by manager name or agency...' :
                mode === 'suburb' ? 'Search by suburb or postcode...' :
                'Search properties, managers, or suburbs...'
              }
              className="flex-1 px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 bg-transparent focus:outline-none text-base"
              autoComplete="off"
              aria-label="Search"
              aria-expanded={isOpen}
              aria-autocomplete="list"
            />
            <button
              type="submit"
              className="m-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Dropdown suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-brand-50 dark:bg-brand-950/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                <div className="flex-shrink-0">{typeIcon[suggestion.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{suggestion.subtitle}</p>
                </div>
                {suggestion.rating != null && (
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {suggestion.rating.toFixed(1)}
                  </div>
                )}
              </button>
            ))}
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={handleSubmit as any}
                className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                See all results for "{query}" →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popular searches */}
      <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
        <span className="text-white/60 text-xs">Popular:</span>
        {['New Farm', 'Surry Hills', 'St Kilda', 'South Brisbane', 'Newtown'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setQuery(term)
              router.push(`/search?q=${encodeURIComponent(term)}&type=suburb`)
            }}
            className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
