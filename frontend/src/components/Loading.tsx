export function Loading({ label = 'Loading your next chapter…' }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-stone-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-moss-100 border-t-moss-700 dark:border-white/10 dark:border-t-moss-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
