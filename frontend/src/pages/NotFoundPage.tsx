import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><p className="font-display text-8xl text-moss-600">404</p><h1 className="mt-4 font-display text-4xl">This page has gone out of print.</h1><Link to="/" className="btn-primary mt-8">Return home</Link></div>
}
