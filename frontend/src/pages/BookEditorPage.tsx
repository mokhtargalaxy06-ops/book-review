import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { getBook, saveBook } from '../api/books'
import { errorMessage } from '../api/client'
import { BookCover } from '../components/BookCover'
import { Loading } from '../components/Loading'
import { Field } from './LoginPage'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author: z.string().min(1, 'Author is required').max(255),
  isbn: z.string().min(10, 'Enter a valid ISBN').max(20),
  description: z.string().min(20, 'Use at least 20 characters').max(10000),
  genre: z.string().min(1, 'Genre is required').max(100),
  published_year: z.string().refine((value) => !value || (Number(value) >= 1000 && Number(value) <= new Date().getFullYear()), 'Enter a valid year'),
  is_featured: z.boolean(),
})
type Values = z.infer<typeof schema>

export function BookEditorPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cover, setCover] = useState<File | null>(null)
  const bookQuery = useQuery({ queryKey: ['book', id], queryFn: () => getBook(id!), enabled: isEditing })
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', author: '', isbn: '', description: '', genre: '', published_year: '', is_featured: false },
  })

  useEffect(() => {
    if (bookQuery.data) {
      if (!bookQuery.data.can_edit) {
        toast.error('Only the person who added this book can edit it.')
        navigate(`/books/${bookQuery.data.id}`, { replace: true })
        return
      }
      form.reset({
        title: bookQuery.data.title,
        author: bookQuery.data.author,
        isbn: bookQuery.data.isbn,
        description: bookQuery.data.description,
        genre: bookQuery.data.genre,
        published_year: bookQuery.data.published_year?.toString() ?? '',
        is_featured: bookQuery.data.is_featured,
      })
    }
  }, [bookQuery.data, form, navigate])

  const submit = form.handleSubmit(async (values) => {
    const payload = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== '') payload.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value)
    })
    if (cover) payload.append('cover', cover)

    try {
      const book = await saveBook(payload, id ? Number(id) : undefined)
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success(isEditing ? 'Book updated.' : 'Book added to the shelves.')
      navigate(`/books/${book.id}`)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  if (isEditing && bookQuery.isLoading) return <Loading />

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={id ? `/books/${id}` : '/books'} className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <BookCover
            src={cover ? URL.createObjectURL(cover) : bookQuery.data?.cover_url ?? null}
            title={form.watch('title') || 'Your book'}
            className="aspect-[4/5] w-full rounded-2xl shadow-book"
          />
          <label className="btn-secondary mt-4 w-full cursor-pointer">
            Choose cover
            <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setCover(event.target.files?.[0] ?? null)} />
          </label>
          <p className="mt-2 text-center text-xs text-stone-500">JPG, PNG, or WebP. Maximum 4 MB.</p>
        </div>

        <div className="surface p-6 sm:p-9">
          <h1 className="font-display text-4xl">{isEditing ? 'Edit this book' : 'Add a book'}</h1>
          <p className="mb-8 mt-2 text-stone-500">{isEditing ? 'Polish the details already on the shelf.' : 'Bring a new title into the conversation.'}</p>
          <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" error={form.formState.errors.title?.message}><input className="field" {...form.register('title')} /></Field>
            <Field label="Author" error={form.formState.errors.author?.message}><input className="field" {...form.register('author')} /></Field>
            <Field label="ISBN" error={form.formState.errors.isbn?.message}><input className="field" {...form.register('isbn')} /></Field>
            <Field label="Genre" error={form.formState.errors.genre?.message}><input className="field" placeholder="Fantasy, Memoir, Mystery…" {...form.register('genre')} /></Field>
            <Field label="Published year" error={form.formState.errors.published_year?.message}><input className="field" type="number" {...form.register('published_year')} /></Field>
            <div className="flex items-end pb-3"><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-moss-700" {...form.register('is_featured')} />Feature on the home page</label></div>
            <div className="sm:col-span-2"><Field label="Description" error={form.formState.errors.description?.message}><textarea className="field min-h-44" {...form.register('description')} /></Field></div>
            <div className="sm:col-span-2"><button className="btn-primary" disabled={form.formState.isSubmitting}><Save className="h-4 w-4" />{form.formState.isSubmitting ? 'Saving…' : 'Save book'}</button></div>
          </form>
        </div>
      </div>
    </div>
  )
}
