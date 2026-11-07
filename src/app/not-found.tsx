import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-4 text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand-700">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-900">Oops! Page not found.</h1>
        <p className="mt-2 text-slate-500">Cette page n'existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-primary mt-6">Retour à l'accueil</Link>
      </div>
    </main>
  )
}
