import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ReviewInput } from '../api/reviews'
import { RatingStars } from './RatingStars'

const schema = z.object({
  rating: z.number().min(1, 'Choose a rating').max(5),
  body: z.string().min(10, 'Write at least 10 characters').max(5000),
})

export function ReviewForm({
  initial,
  onSubmit,
  submitLabel = 'Publish review',
  onCancel,
}: {
  initial?: ReviewInput
  onSubmit: (values: ReviewInput) => Promise<void>
  submitLabel?: string
  onCancel?: () => void
}) {
  const form = useForm<ReviewInput>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { rating: 0, body: '' },
  })
  const rating = form.watch('rating')

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Your rating</label>
        <RatingStars value={rating} onChange={(value) => form.setValue('rating', value, { shouldValidate: true })} size="lg" />
        {form.formState.errors.rating && <p className="mt-1 text-xs text-red-600">{form.formState.errors.rating.message}</p>}
      </div>
      <div>
        <label className="label">Your review</label>
        <textarea
          className="field min-h-36 resize-y"
          placeholder="What stayed with you? What didn’t work?"
          {...form.register('body')}
        />
        {form.formState.errors.body && <p className="mt-1 text-xs text-red-600">{form.formState.errors.body.message}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" disabled={form.formState.isSubmitting}>
          <Send className="h-4 w-4" /> {form.formState.isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
