import { useEffect, useState } from 'react'
import { BookMarked, LogOut, Menu, Moon, Plus, Sun, UserRound, X } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-moss-100 text-moss-900 dark:bg-white/10 dark:text-white'
      : 'text-stone-600 hover:text-moss-700 dark:text-stone-300 dark:hover:text-white',
  )

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.theme === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('You’re signed out. Happy reading.')
      navigate('/')
    } catch {
      toast.error('Could not sign out. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-parchment/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#101612]/90">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss-700 text-white">
              <BookMarked className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-xl leading-none">Leaf & Lore</span>
              <span className="text-[10px] uppercase tracking-[.2em] text-stone-500">Book society</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/books" className={navClass}>Browse</NavLink>
            {user && <NavLink to="/profile" className={navClass}>My reviews</NavLink>}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              className="btn-secondary !p-2.5"
              onClick={() => setDark((value) => !value)}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <>
                <Link to="/books/new" className="btn-primary !px-4 !py-2.5">
                  <Plus className="h-4 w-4" /> Add book
                </Link>
                <button className="btn-secondary !p-2.5" onClick={handleLogout} aria-label="Log out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !px-4 !py-2.5">Log in</Link>
                <Link to="/register" className="btn-primary !px-4 !py-2.5">Join the club</Link>
              </>
            )}
          </div>

          <button className="btn-secondary !p-2.5 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-stone-200 px-4 py-4 dark:border-white/10 md:hidden">
            <div className="flex flex-col gap-1" onClick={() => setOpen(false)}>
              <NavLink to="/" className={navClass}>Home</NavLink>
              <NavLink to="/books" className={navClass}>Browse</NavLink>
              {user && <NavLink to="/profile" className={navClass}>My reviews</NavLink>}
              {user && <NavLink to="/books/new" className={navClass}><Plus className="mr-2 inline h-4 w-4" />Add book</NavLink>}
              {!user && <NavLink to="/login" className={navClass}><UserRound className="mr-2 inline h-4 w-4" />Log in</NavLink>}
            </div>
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="mt-24 border-t border-stone-200/80 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Leaf & Lore — a quieter place to find your next great read.</p>
          <p>Made for readers, reviewers, and incurable shelf-fillers.</p>
        </div>
      </footer>
    </div>
  )
}
