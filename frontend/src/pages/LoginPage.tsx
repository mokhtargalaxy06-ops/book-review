import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { errorMessage } from '../api/client'
import { useAuth } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})
type FormData = z.infer<typeof schema>

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '', remember: false } })

  if (user) return <Navigate to="/profile" replace />

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values)
      toast.success('Welcome back to the shelves.')
      const from = (location.state as { from?: string } | null)?.from ?? '/profile'
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <AuthShell title="Welcome back" subtitle="Your bookmarks have been keeping your place.">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input className="field" type="email" autoComplete="email" {...form.register('email')} />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <input className="field" type="password" autoComplete="current-password" {...form.register('password')} />
        </Field>
        <label className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
          <input type="checkbox" className="h-4 w-4 accent-moss-700" {...form.register('remember')} />
          Remember me on this device
        </label>
        <button className="btn-primary w-full" disabled={form.formState.isSubmitting}>
          <LogIn className="h-4 w-4" /> {form.formState.isSubmitting ? 'Opening the door…' : 'Log in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">New here? <Link className="font-semibold text-moss-700 dark:text-moss-100" to="/register">Join the book club</Link></p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden pr-16 lg:block">
        <BookOpen className="h-12 w-12 text-moss-600" />
        <blockquote className="mt-8 font-display text-4xl leading-tight">“A reader lives a thousand lives before he dies.”</blockquote>
        <p className="mt-4 text-stone-500">— George R. R. Martin</p>
      </div>
      <div className="surface mx-auto w-full max-w-lg p-7 sm:p-10">
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="mb-8 mt-2 text-stone-500 dark:text-stone-400">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}{error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}</div>
}
