import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBooks } from '../api/books'
import { BookCard } from '../components/BookCard'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'

export function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['books', 'featured'],
    queryFn: () => getBooks({ featured: true, per_page: 8, sort: 'rating' }),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate(`/books?search=${encodeURIComponent(search)}`)
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(214,155,66,.22),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(79,124,89,.2),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-moss-500/20 bg-moss-50 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-moss-700 dark:bg-moss-900/30 dark:text-moss-100">
              <Sparkles className="h-4 w-4" /> Stories worth talking about
            </span>
            <h1 className="max-w-3xl font-display text-5xl leading-[.98] sm:text-6xl lg:text-7xl">
              Find the book that stays with you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              Thoughtful reviews, honest ratings, and a growing library curated by people who still
              lose track of time between pages.
            </p>
            <form onSubmit={submit} className="mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  className="field !py-4 !pl-12"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, author, or genre"
                />
              </div>
              <button className="btn-primary !px-7">Explore books</button>
            </form>
          </div>

          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute left-12 top-2 h-80 w-52 rotate-[-9deg] rounded-md bg-moss-900 p-7 text-white shadow-2xl">
              <p className="font-display text-3xl">Read deeply.</p>
              <div className="mt-24 h-px bg-white/25" />
              <p className="mt-4 text-sm text-white/60">Leave better notes in the margins of your life.</p>
            </div>
            <div className="absolute right-8 top-20 h-80 w-52 rotate-[7deg] rounded-md bg-amberbook p-7 text-ink shadow-2xl">
              <p className="font-display text-3xl">Share freely.</p>
              <div className="mt-24 h-px bg-ink/20" />
              <p className="mt-4 text-sm text-ink/60">A good review is a tiny door held open.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-moss-600">Reader favorites</p>
            <h2 className="mt-2 font-display text-4xl">Featured on the shelf</h2>
          </div>
          <Link to="/books" className="hidden items-center gap-2 text-sm font-semibold text-moss-700 sm:flex dark:text-moss-100">
            Browse everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data?.data.length ? data.data.map((book) => <BookCard key={book.id} book={book} />) : (
              <EmptyState title="The featured shelf is waiting" message="Browse the full library while our readers choose their current favorites." />
            )}
          </div>
        )}
      </section>
    </>
  )
}
