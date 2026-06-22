import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookHeart, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { errorMessage } from '../api/client'
import { getMyReviews, updateProfile } from '../api/profile'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RatingStars } from '../components/RatingStars'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../lib/utils'
import { Field } from './LoginPage'

const schema = z.object({ name: z.string().min(2), email: z.string().email() })
type Values = z.infer<typeof schema>

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const reviews = useQuery({ queryKey: ['my-reviews', page], queryFn: () => getMyReviews(page) })
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '' } })

  useEffect(() => {
    if (user) form.reset({ name: user.name, email: user.email ?? '' })
  }, [form, user])

  const submit = form.handleSubmit(async (values) => {
    try {
      await updateProfile(values)
      await refreshUser()
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] })
      toast.success('Profile updated.')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside>
          <div className="surface p-6 lg:sticky lg:top-28">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-moss-700 font-display text-3xl text-white">{user?.name.charAt(0).toUpperCase()}</div>
            <h1 className="mt-5 font-display text-3xl">{user?.name}</h1>
            <p className="text-sm text-stone-500">Reader since {user?.created_at ? formatDate(user.created_at) : 'today'}</p>
            <form onSubmit={submit} className="mt-7 space-y-4 border-t border-stone-200 pt-6 dark:border-white/10">
              <Field label="Name" error={form.formState.errors.name?.message}><input className="field" {...form.register('name')} /></Field>
              <Field label="Email" error={form.formState.errors.email?.message}><input className="field" type="email" {...form.register('email')} /></Field>
              <button className="btn-secondary w-full" disabled={form.formState.isSubmitting}><Save className="h-4 w-4" />Save profile</button>
            </form>
          </div>
        </aside>

        <section>
          <div className="flex items-center gap-3">
            <BookHeart className="h-8 w-8 text-moss-600" />
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-moss-600">Your reading history</p><h2 className="font-display text-4xl">My reviews</h2></div>
          </div>
          {reviews.isLoading ? <Loading /> : (
            <div className="mt-7 space-y-5">
              {reviews.data?.data.length ? reviews.data.data.map((review) => (
                <Link key={review.id} to={`/books/${review.book?.id}`} className="surface block p-6 transition hover:-translate-y-0.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h3 className="font-display text-2xl">{review.book?.title}</h3><p className="text-sm text-stone-500">by {review.book?.author} · {formatDate(review.created_at)}</p></div>
                    <RatingStars value={review.rating} size="sm" />
                  </div>
                  <p className="mt-4 line-clamp-3 leading-7 text-stone-700 dark:text-stone-300">{review.body}</p>
                </Link>
              )) : <EmptyState title="Your review shelf is empty" message="Find a book you’ve read and leave the first mark in your reading history." />}
            </div>
          )}
          {reviews.data && reviews.data.meta.last_page > 1 && <div className="mt-8 flex gap-3"><button className="btn-secondary" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button className="btn-secondary" disabled={page === reviews.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>Next</button></div>}
        </section>
      </div>
    </div>
  )
}
