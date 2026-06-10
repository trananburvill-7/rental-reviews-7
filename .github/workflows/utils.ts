import crypto from 'crypto'

// ============================================================
// Slug utilities
// ============================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function propertySlug(address: string, suburb: string, state: string): string {
  return slugify(`${address} ${suburb} ${state}`)
}

// ============================================================
// Rating helpers
// ============================================================

export function getRatingColor(rating: number | null): string {
  if (!rating) return 'text-gray-400'
  if (rating >= 4.5) return 'text-emerald-600'
  if (rating >= 4.0) return 'text-green-600'
  if (rating >= 3.0) return 'text-amber-600'
  if (rating >= 2.0) return 'text-orange-600'
  return 'text-red-600'
}

export function getRatingBg(rating: number | null): string {
  if (!rating) return 'bg-gray-100 text-gray-500'
  if (rating >= 4.5) return 'bg-emerald-100 text-emerald-800'
  if (rating >= 4.0) return 'bg-green-100 text-green-800'
  if (rating >= 3.0) return 'bg-amber-100 text-amber-800'
  if (rating >= 2.0) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

export function getRatingLabel(rating: number | null): string {
  if (!rating) return 'No reviews'
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4.0) return 'Very Good'
  if (rating >= 3.5) return 'Good'
  if (rating >= 3.0) return 'Average'
  if (rating >= 2.0) return 'Below Average'
  return 'Poor'
}

export function formatRating(rating: number | null): string {
  if (!rating) return '–'
  return rating.toFixed(1)
}

// Star rating fill percentage
export function starFill(rating: number, star: number): 'full' | 'half' | 'empty' {
  const diff = rating - (star - 1)
  if (diff >= 1) return 'full'
  if (diff >= 0.5) return 'half'
  return 'empty'
}

// ============================================================
// IP hashing (privacy-preserving)
// ============================================================

export function hashIP(ip: string): string {
  // Hash with daily salt for rate limiting while preserving privacy
  const today = new Date().toISOString().slice(0, 10)
  return crypto
    .createHmac('sha256', `rentview-${today}`)
    .update(ip)
    .digest('hex')
    .slice(0, 32)
}

export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '0.0.0.0'
  )
}

// ============================================================
// Rate limiting (in-memory + DB backed)
// ============================================================

export async function checkRateLimit(
  ip: string,
  action: string,
  maxRequests: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number }> {
  // Simple in-memory rate limiting for edge
  // In production, use Upstash Redis
  const key = `${ip}:${action}`
  const windowMs = windowMinutes * 60 * 1000

  if (typeof globalThis !== 'undefined' && !(globalThis as any).__rateLimitStore) {
    ;(globalThis as any).__rateLimitStore = new Map()
  }
  const store = (globalThis as any).__rateLimitStore as Map<
    string,
    { count: number; resetAt: number }
  >

  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

// ============================================================
// Content sanitisation
// ============================================================

const PROFANITY_LIST = [
  // Basic list - in production use a proper API
  'spam', 'fake',
]

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase()
  return PROFANITY_LIST.some((word) => lower.includes(word))
}

export function sanitizeText(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 3000) // Max length
}

// ============================================================
// Turnstile CAPTCHA verification
// ============================================================

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey || secretKey === 'your_turnstile_secret_key') {
    // Skip verification in development
    return true
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          remoteip: ip,
        }),
      }
    )
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}

// ============================================================
// Admin auth
// ============================================================

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false
  const adminKey = process.env.ADMIN_SECRET_KEY
  if (!adminKey || adminKey.length < 16) return false
  return token === adminKey
}

export function getAdminToken(headers: Headers): string | null {
  const authHeader = headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

// ============================================================
// Date formatting
// ============================================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// ============================================================
// Number formatting
// ============================================================

export function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return count.toString()
}

// ============================================================
// SEO metadata helpers
// ============================================================

export function generatePropertyMeta(property: {
  address: string
  suburb: string
  state: string
  avg_overall?: number | null
  review_count?: number
}) {
  const ratingText =
    property.avg_overall && property.review_count
      ? ` — Rated ${property.avg_overall.toFixed(1)}/5 from ${property.review_count} review${property.review_count !== 1 ? 's' : ''}`
      : ''

  return {
    title: `${property.address}, ${property.suburb} ${property.state} Reviews | RentView`,
    description: `Read tenant reviews for ${property.address}, ${property.suburb} ${property.state}${ratingText}. Find out what it's really like to rent this property.`,
  }
}

export function generateManagerMeta(manager: {
  name: string
  agency?: string | null
  avg_overall?: number | null
  review_count?: number
}) {
  const agencyText = manager.agency ? ` at ${manager.agency}` : ''
  const ratingText =
    manager.avg_overall && manager.review_count
      ? ` — Rated ${manager.avg_overall.toFixed(1)}/5 from ${manager.review_count} review${manager.review_count !== 1 ? 's' : ''}`
      : ''

  return {
    title: `${manager.name}${agencyText} — Property Manager Reviews | RentView`,
    description: `Read tenant reviews for property manager ${manager.name}${agencyText}${ratingText}. Is this property manager worth renting through?`,
  }
}

// ============================================================
// Suburb URL helpers
// ============================================================

export function suburbSlug(suburb: string, state: string): string {
  return slugify(`${suburb}-${state}`)
}

export function parseSuburbSlug(slug: string): { suburb: string; state: string } | null {
  // Format: "new-farm-qld" or "surry-hills-nsw"
  const states = ['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt']
  for (const state of states) {
    if (slug.endsWith(`-${state}`)) {
      const suburb = slug.slice(0, -(state.length + 1)).replace(/-/g, ' ')
      return {
        suburb: suburb
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        state: state.toUpperCase(),
      }
    }
  }
  return null
}
