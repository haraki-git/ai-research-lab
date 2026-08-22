import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-7 w-7', className)}
      aria-hidden
      fill="none"
    >
      <rect width="32" height="32" rx="5" className="fill-foreground/90" />
      <path
        d="M16 5 L27 16 L16 27 L5 16 Z"
        stroke="var(--color, hsl(var(--background)))"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3.2" className="fill-primary" />
      <path
        d="M16 2.5 V8 M16 24 V29.5 M2.5 16 H8 M24 16 H29.5"
        stroke="var(--color, hsl(var(--background)))"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Brand({
  tagline = true,
  className,
  markClassName,
}: {
  tagline?: boolean
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-sm font-bold tracking-tight text-foreground">
          AI Prompt Research Lab
        </span>
        {tagline && (
          <span className="mono-label mt-1 hidden normal-case tracking-[0.14em] sm:block">
            Instrumentation &amp; Evaluation
          </span>
        )}
      </span>
    </span>
  )
}