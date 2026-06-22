import { Link } from 'react-router-dom'
import type { Book } from '../types'
import { BookCover } from './BookCover'
import { RatingStars } from './RatingStars'

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200/80 bg-white/70 shadow-book transition duration-300 hover:-translate-y-1.5 dark:border-white/10 dark:bg-white/[0.04]"
    >
      <div className="aspect-[4/5] overflow-hidden bg-stone-200">
        <BookCover
          src={book.cover_url}
          title={book.title}
          className="h-full w-full transition duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-moss-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-moss-700 dark:bg-moss-900/60 dark:text-moss-100">
            {book.genre}
          </span>
          <span className="text-xs text-stone-500">{book.published_year ?? '—'}</span>
        </div>
        <h3 className="line-clamp-2 font-display text-xl leading-tight group-hover:text-moss-700 dark:group-hover:text-moss-100">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">by {book.author}</p>
        <div className="mt-4 flex items-center justify-between">
          <RatingStars value={book.average_rating} size="sm" />
          <span className="text-xs text-stone-500">
            {book.reviews_count} {book.reviews_count === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>
    </Link>
  )
}
