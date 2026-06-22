import { BookOpen } from 'lucide-react'
import { cn } from '../lib/utils'

interface BookCoverProps {
  src: string | null
  title: string
  className?: string
}

export function BookCover({ src, title, className }: BookCoverProps) {
  if (src) {
    return <img src={src} alt={`Cover of ${title}`} className={cn('object-cover', className)} />
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gradient-to-br from-moss-900 via-moss-700 to-amberbook p-5 text-center text-white',
        className,
      )}
    >
      <BookOpen className="mb-4 h-9 w-9 opacity-80" />
      <span className="font-display text-xl leading-tight">{title}</span>
    </div>
  )
}
