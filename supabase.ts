import { createClient } from '@supabase/supabase-js'

// ============================================================
// Types
// ============================================================
type SupabaseClient = ReturnType<typeof createClient>

// ============================================================
// Browser client (used in client components)
// ============================================================
let browserClient: SupabaseClient | null = null

export function createBrowserClient() {
  if (browserClient) return browserClient

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}

// ============================================================
// Server client (used in Server Components & API routes)
// Uses anon key - respects RLS
// ============================================================
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

// ============================================================
// Admin client (bypasses RLS - SERVER ONLY)
// Never expose to client
// ============================================================
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
