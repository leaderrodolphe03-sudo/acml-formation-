import { createElement, Fragment, type CSSProperties } from 'react'

/*
 * Texte animé mot par mot.
 * - « rise » : chaque mot remonte derrière un masque (titres) ;
 *   « fade » : chaque mot sort d'un léger flou (paragraphes).
 * - « load » : part à l'affichage (haut de page) ; « scroll » : part quand le texte
 *   entre à l'écran (voir ScrollReveal).
 * - Les lecteurs d'écran lisent le texte complet (copie sr-only).
 */

type Line = string | { text: string; className?: string }

type Props = {
  text: string | Line[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote'
  className?: string
  id?: string
  mode?: 'rise' | 'fade'
  trigger?: 'load' | 'scroll'
  /** délai avant le premier mot, en secondes */
  delay?: number
  /** mots (sans ponctuation) affichés en rouge ACML, soulignés */
  highlight?: string[]
}

export function AnimatedText({ text, as = 'p', className = '', id, mode = 'rise', trigger = 'scroll', delay = 0, highlight = [] }: Props) {
  const lines = (Array.isArray(text) ? text : [text]).map((l) => (typeof l === 'string' ? { text: l } : l))
  const full = lines.map((l) => l.text).join(' ')
  const step = mode === 'rise' ? 0.055 : 0.012
  const marks = new Set(highlight.map((h) => h.toLowerCase()))
  let i = 0

  const visual = lines.map((line, li) => {
    const words = line.text.split(/\s+/).filter(Boolean)
    const content = words.map((w, wi) => {
      const index = i++
      const isMark = marks.has(w.replace(/[.,;:!?’'«»]/g, '').toLowerCase())
      return (
        <Fragment key={wi}>
          <span className={`w${isMark ? ' w--mark' : ''}`}>
            <span style={{ '--i': index } as CSSProperties}>{w}</span>
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      )
    })
    return lines.length > 1 ? (
      <span key={li} className={`block ${line.className ?? ''}`}>
        {content}
      </span>
    ) : (
      <Fragment key={li}>{content}</Fragment>
    )
  })

  return createElement(
    as,
    {
      id,
      className: `atext atext--${mode} atext--${trigger} ${className}`,
      style: { '--d': `${delay}s`, '--step': `${step}s` } as CSSProperties,
      ...(trigger === 'scroll' ? { 'data-reveal-text': '' } : {}),
    },
    <span className="sr-only">{full}</span>,
    <span aria-hidden="true">{visual}</span>,
  )
}
