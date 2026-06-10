'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Building2,
  Users,
  MapPin,
  Star,
  ChevronDown,
} from 'lucide-react'

const navLinks = [
  {
    label: 'Properties',
    href: '/search?type=property',
    icon: Building2,
  },
  {
    label: 'Managers',
    href: '/search?type=manager',
    icon: Users,
  },
  {
    label: 'Suburbs',
    href: '/search?type=suburb',
    icon: MapPin,
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'
  const isTransparent = isHome && !isScrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm'
      }`}
      style={{ height: 'var(--rv-nav-height)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isTransparent ? 'bg-white/20' : 'bg-brand-600'
          }`}>
            <Star className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className={`font-display transition-colors ${
            isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            RentView
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname?.startsWith(link.href.split('?')[0])
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isTransparent
                    ? isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    : isActive
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search icon shortcut */}
          <Link
            href="/search"
            className={`p-2 rounded-md transition-colors ${
              isTransparent
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-md transition-colors ${
              isTransparent
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Leave a review CTA */}
          <Link
            href="/search?action=review"
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isTransparent
                ? 'bg-white text-brand-700 hover:bg-white/90'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            Write a Review
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-md transition-colors ${
              isTransparent
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/search?action=review"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
              >
                <Star className="w-5 h-5" />
                Write a Review
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
