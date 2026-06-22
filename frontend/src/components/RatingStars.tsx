import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function RatingStars({ value, onChange, size = 'md', showValue = false }: RatingStarsProps) {
  const dimensions = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'

  return (
    <div className="inline-flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value)
        const icon = (
          <Star
            className={cn(
              dimensions,
              filled ? 'fill-amberbook text-amberbook' : 'text-stone-300 dark:text-stone-600',
            )}
          />
        )

        return onChange ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-sm transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-moss-500"
            aria-label={`Rate ${star} stars`}
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        )
      })}
      {showValue && <span className="ml-1 text-sm font-semibold">{value.toFixed(1)}</span>}
    </div>
  )
}
