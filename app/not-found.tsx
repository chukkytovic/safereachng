import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-surface-dark border border-border flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-text-muted">404</span>
      </div>
      <h1 className="font-bold text-2xl text-text-primary mb-3">Page Not Found</h1>
      <p className="text-text-secondary mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors">
        Go Home
      </Link>
    </div>
  )
}
