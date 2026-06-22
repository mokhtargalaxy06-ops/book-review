import { Library } from 'lucide-react'

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="surface col-span-full flex min-h-64 flex-col items-center justify-center p-10 text-center">
      <Library className="mb-4 h-10 w-10 text-moss-600" />
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">{message}</p>
    </div>
  )
}
