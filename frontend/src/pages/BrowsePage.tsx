import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBooks, getGenres } from '../api/books'
import { BookCard } from '../components/BookCard'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { useDebounce } from '../hooks/useDebounce'

export function BrowsePage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') ?? '')
  const debouncedSearch = useDebounce(search)
  const page = Number(params.get('page') ?? 1)
  const genre = params.get('genre') ?? ''
  const sort = params.get('sort') ?? 'newest'
  const rating = params.get('rating') ?? ''

  useEffect(() => {
    setParams((current) => {
      if (debouncedSearch) current.set('search', debouncedSearch)
      else current.delete('search')
      current.delete('page')
      return current
    }, { replace: true })
  }, [debouncedSearch, setParams])

  const filters = { search: debouncedSearch, genre, sort, rating, page, per_page: 12 }
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => getBooks(filters),
  })
  const genres = useQuery({ queryKey: ['genres'], queryFn: getGenres })

  const update = (key: string, value: string) => {
    setParams((current) => {
      if (value) current.set(key, value)
      else current.delete(key)
      current.delete('page')
      return current
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-moss-600">The whole collection</p>
        <h1 className="mt-2 font-display text-5xl">Browse the shelves</h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">
          Filter by mood, reputation, or the old-fashioned magic of a title catching your eye.
        </p>
      </div>

      <div className="surface mt-9 grid gap-4 p-4 md:grid-cols-[1fr_200px_180px_180px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="field !pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the library" />
        </div>
        <select className="field" value={genre} onChange={(event) => update('genre', event.target.value)}>
          <option value="">All genres</option>
          {genres.data?.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="field" value={rating} onChange={(event) => update('rating', event.target.value)}>
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
        <select className="field" value={sort} onChange={(event) => update('sort', event.target.value)}>
          <option value="newest">Newest added</option>
          <option value="rating">Highest rated</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-stone-500">
        <SlidersHorizontal className="h-4 w-4" />
        {data ? `${data.meta.total} books found` : 'Searching the stacks…'}
      </div>

      {isLoading ? <Loading /> : isError ? (
        <EmptyState title="The library could not be reached" message="Check that the Laravel API is running, then try again." />
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.length ? data.data.map((book) => <BookCard key={book.id} book={book} />) : (
            <EmptyState title="No books on this shelf" message="Try a broader search or clear one of your filters." />
          )}
        </div>
      )}

      {data && data.meta.last_page > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <button className="btn-secondary" disabled={!data.links.prev} onClick={() => update('page', String(page - 1))}>Previous</button>
          <span className="grid min-w-24 place-items-center text-sm text-stone-500">Page {page} of {data.meta.last_page}</span>
          <button className="btn-secondary" disabled={!data.links.next} onClick={() => update('page', String(page + 1))}>Next</button>
        </div>
      )}
    </div>
  )
}
