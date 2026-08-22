import { redirect, notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function LocaleCatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>
}) {
  const { rest } = await params

  // If the first segment of rest is a valid locale,
  // the URL has duplicate locale prefixes (e.g. /en/zh/id).
  // Normalize by redirecting to the correct single-prefixed URL.
  const locales = routing.locales as readonly string[]
  if (rest.length > 0 && locales.includes(rest[0])) {
    redirect('/' + rest.join('/'))
  }

  // No valid page for this path under this locale
  notFound()
}