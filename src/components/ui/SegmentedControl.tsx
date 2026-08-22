import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}