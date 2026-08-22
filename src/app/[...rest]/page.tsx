import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ rest: string[] }>
}) {
  const { rest } = await params
  const path = rest.join('/')

  const first = rest[0]
  if (first === 'api' || first === 'trpc' || first === '_next' || first === '_vercel') {
    redirect(`/${routing.defaultLocale}/${path}`)
  }

  redirect(`/${routing.defaultLocale}${path ? `/${path}` : ''}`)
}