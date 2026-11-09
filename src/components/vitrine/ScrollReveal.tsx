'use client'

import { useEffect } from 'react'

/*
 * Apparition des éléments au défilement : tout élément portant `data-reveal`,
 * `data-reveal-stagger` (cascade sur ses enfants) ou `data-reveal-text` reçoit
 * `is-visible` quand il entre à l'écran. Rien n'est masqué sans JavaScript
 * (la classe `js-reveal` est posée par un script dans le layout).
 */
export function ScrollReveal() {
  useEffect(() => {
    ;(window as Window & { __siteReady?: boolean }).__siteReady = true
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target
          el.classList.add('is-visible')
          io.unobserve(el)
          // une fois l'apparition finie, on retire les délais de cascade (survol plus réactif)
          window.setTimeout(() => el.classList.add('reveal-done'), 1500)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )
    const scan = () =>
      document
        .querySelectorAll('[data-reveal]:not(.is-visible), [data-reveal-stagger]:not(.is-visible), [data-reveal-text]:not(.is-visible)')
        .forEach((el) => io.observe(el))
    const mo = new MutationObserver(scan)
    const start = () => {
      scan()
      mo.observe(document.body, { childList: true, subtree: true })
    }
    // après l'hydratation, quand le navigateur est libre
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    const idle = ric ? ric(start, { timeout: 1500 }) : window.setTimeout(start, 200)
    return () => {
      if (ric) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
