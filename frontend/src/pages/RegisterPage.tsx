import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { errorMessage } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { AuthShell, Field } from './LoginPage'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters').regex(/[A-Za-z]/, 'Include a letter').regex(/[0-9]/, 'Include a number'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})
type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '', password_confirmation: '' } })

  if (user) return <Navigate to="/profile" replace />

  const submit = form.handleSubmit(async (values) => {
    try {
      await register(values)
      toast.success('Welcome to Leaf & Lore.')
      navigate('/profile')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <AuthShell title="Join the conversation" subtitle="Build your reading history, one honest review at a time.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" error={form.formState.errors.name?.message}><input className="field" autoComplete="name" {...form.register('name')} /></Field>
        <Field label="Email" error={form.formState.errors.email?.message}><input className="field" type="email" autoComplete="email" {...form.register('email')} /></Field>
        <Field label="Password" error={form.formState.errors.password?.message}><input className="field" type="password" autoComplete="new-password" {...form.register('password')} /></Field>
        <Field label="Confirm password" error={form.formState.errors.password_confirmation?.message}><input className="field" type="password" autoComplete="new-password" {...form.register('password_confirmation')} /></Field>
        <button className="btn-primary mt-2 w-full" disabled={form.formState.isSubmitting}><UserPlus className="h-4 w-4" />Create my account</button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">Already a member? <Link className="font-semibold text-moss-700 dark:text-moss-100" to="/login">Log in</Link></p>
    </AuthShell>
  )
}
