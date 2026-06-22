import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Edit3, Hash, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getBook, deleteBook } from '../api/books'
import { errorMessage } from '../api/client'
import { createReview, deleteReview, updateReview, type ReviewInput } from '../api/reviews'
import { BookCover } from '../components/BookCover'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RatingStars } from '../components/RatingStars'
import { ReviewForm } from '../components/ReviewForm'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../lib/utils'
import type { Book, Review } from '../types'

export function BookDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<number | null>(null)
  const { data: book, isLoading, isError } = useQuery({ queryKey: ['book', id], queryFn: () => getBook(id) })

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['book', id] })
  const createMutation = useMutation({
    mutationFn: (values: ReviewInput) => createReview(Number(id), values),
    onSuccess: () => { toast.success('Your review is on the shelf.'); refresh() },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const updateMutation = useMutation({
    mutationFn: ({ reviewId, values }: { reviewId: number; values: ReviewInput }) => updateReview(reviewId, values),
    onSuccess: () => { setEditing(null); toast.success('Review updated.'); refresh() },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const removeMutation = useMutation({
    mutationFn: deleteReview,
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ['book', id] })
      const previous = queryClient.getQueryData<Book>(['book', id])
      queryClient.setQueryData<Book>(['book', id], (current) => current ? ({
        ...current,
        reviews: current.reviews?.filter((review) => review.id !== reviewId),
        reviews_count: Math.max(0, current.reviews_count - 1),
      }) : current)
      return { previous }
    },
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['book', id], context.previous)
      toast.error(errorMessage(error))
    },
    onSuccess: () => toast.success('Review removed.'),
    onSettled: refresh,
  })

  if (isLoading) return <Loading />
  if (isError || !book) return <div className="mx-auto max-w-5xl px-4 py-16"><EmptyState title="This book slipped off the shelf" message="It may have been removed, or the API may be unavailable." /></div>

  const ownReview = book.reviews?.find((review) => review.user.id === user?.id)
  const removeBook = async () => {
    if (!window.confirm(`Delete “${book.title}” and all its reviews?`)) return
    try {
      await deleteBook(book.id)
      toast.success('Book deleted.')
      navigate('/books')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/books" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-moss-700">
        <ArrowLeft className="h-4 w-4" /> Back to the shelves
      </Link>

      <section className="grid gap-10 lg:grid-cols-[330px_1fr]">
        <BookCover src={book.cover_url} title={book.title} className="aspect-[4/5] w-full rounded-2xl shadow-book" />
        <div className="py-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-moss-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-moss-700 dark:bg-moss-900/50 dark:text-moss-100">{book.genre}</span>
            {book.is_featured && <span className="rounded-full bg-amberbook/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">Featured</span>}
          </div>
          <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">{book.title}</h1>
          <p className="mt-3 text-xl text-stone-500">by {book.author}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <RatingStars value={book.average_rating} showValue size="lg" />
            <span className="flex items-center gap-2 text-sm text-stone-500"><MessageSquare className="h-4 w-4" />{book.reviews_count} reviews</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-y border-stone-200 py-5 text-sm text-stone-500 dark:border-white/10">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />Published {book.published_year ?? 'year unknown'}</span>
            <span className="flex items-center gap-2"><Hash className="h-4 w-4" />ISBN {book.isbn}</span>
          </div>
          <p className="mt-8 whitespace-pre-line text-base leading-8 text-stone-700 dark:text-stone-300">{book.description}</p>
          {book.can_edit && (
            <div className="mt-8 flex gap-3">
              <Link to={`/books/${book.id}/edit`} className="btn-secondary"><Pencil className="h-4 w-4" />Edit book</Link>
              <button className="btn-secondary !text-red-600" onClick={removeBook}><Trash2 className="h-4 w-4" />Delete</button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-display text-4xl">What readers are saying</h2>
          <div className="mt-7 space-y-5">
            {book.reviews?.length ? book.reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                editing={editing === review.id}
                onEdit={() => setEditing(review.id)}
                onCancel={() => setEditing(null)}
                onUpdate={(values) => updateMutation.mutateAsync({ reviewId: review.id, values }).then(() => undefined)}
                onDelete={() => removeMutation.mutate(review.id)}
              />
            )) : <EmptyState title="No reviews yet" message="This book is waiting for its first thoughtful reader." />}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface p-6">
            <h2 className="font-display text-3xl">Write a review</h2>
            {!user ? (
              <p className="mt-4 text-sm leading-6 text-stone-500">You’ll need to <Link to="/login" state={{ from: `/books/${book.id}` }} className="font-semibold text-moss-700 dark:text-moss-100">log in</Link> before sharing your thoughts.</p>
            ) : ownReview ? (
              <p className="mt-4 text-sm leading-6 text-stone-500">You’ve already reviewed this book. You can edit your review in the list.</p>
            ) : (
              <div className="mt-6"><ReviewForm onSubmit={(values) => createMutation.mutateAsync(values).then(() => undefined)} /></div>
            )}
          </div>
        </aside>
      </section>
    </div>
  )
}

function ReviewItem({ review, editing, onEdit, onCancel, onUpdate, onDelete }: {
  review: Review
  editing: boolean
  onEdit: () => void
  onCancel: () => void
  onUpdate: (values: ReviewInput) => Promise<void>
  onDelete: () => void
}) {
  return (
    <article className="surface p-6">
      {editing ? <ReviewForm initial={{ rating: review.rating, body: review.body }} onSubmit={onUpdate} submitLabel="Save changes" onCancel={onCancel} /> : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-moss-100 font-bold text-moss-700 dark:bg-moss-900/50 dark:text-moss-100">{review.user.name.charAt(0).toUpperCase()}</span>
                <div><p className="font-semibold">{review.user.name}</p><p className="text-xs text-stone-500">{formatDate(review.created_at)}</p></div>
              </div>
            </div>
            <RatingStars value={review.rating} size="sm" />
          </div>
          <p className="mt-5 whitespace-pre-line leading-7 text-stone-700 dark:text-stone-300">{review.body}</p>
          {review.can_edit && <div className="mt-5 flex gap-3"><button className="text-sm font-semibold text-moss-700 dark:text-moss-100" onClick={onEdit}><Edit3 className="mr-1.5 inline h-4 w-4" />Edit</button><button className="text-sm font-semibold text-red-600" onClick={onDelete}><Trash2 className="mr-1.5 inline h-4 w-4" />Delete</button></div>}
        </>
      )}
    </article>
  )
}
