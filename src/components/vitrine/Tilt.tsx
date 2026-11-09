'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Incline légèrement son contenu en suivant la souris (rien au tactile ni si « réduire les animations »). */
export function Tilt({ children, className = '', max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
        el.style.setProperty('--rx', `${(x * max * 2).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(-y * max * 2).toFixed(2)}deg`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [max])

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  )
}
