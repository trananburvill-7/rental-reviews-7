import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function ReviewDisclaimer() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
      <p>
        Reviews on this platform represent the personal opinions of individual tenants and are not statements of fact. All reviews are moderated before publication.{' '}
        <Link href="/legal/guidelines" className="underline underline-offset-2 hover:no-underline">
          Review Guidelines
        </Link>
        {' '}·{' '}
        <Link href="/report" className="underline underline-offset-2 hover:no-underline">
          Report a Review
        </Link>
      </p>
    </div>
  )
}
