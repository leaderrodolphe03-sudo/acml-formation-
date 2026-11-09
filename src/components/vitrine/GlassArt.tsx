/*
 * Illustrations vectorielles originales, style « verre » aux couleurs ACML.
 * L'objet central est une bulle de dialogue (le symbole d'une école de langue)
 * en verre bleu, accompagnée d'une petite bulle rouge.
 */

type Props = { id: string; className?: string }

// Bulle principale : corps arrondi + queue en bas à gauche (cadre 240 × 240)
const BUBBLE =
  'M120 28c56 0 96 34 96 78s-40 78-96 78c-12 0-24-1.6-35-4.6L46 214l10-44C35 156 24 132 24 106c0-44 40-78 96-78z'
// Petite bulle : queue en bas à droite
const SMALL =
  'M60 10c28 0 50 17 50 39 0 9-4 17-10 24l6 22-22-12c-7 3-15 5-24 5-28 0-50-17-50-39S32 10 60 10z'

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-blue`} x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stopColor="#EAF3FF" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#5B9BE0" stopOpacity="0.85" />
        <stop offset="1" stopColor="#0A3A70" stopOpacity="0.96" />
      </linearGradient>
      <radialGradient id={`${id}-core`} cx="0.45" cy="0.38" r="0.6">
        <stop offset="0" stopColor="#D6E8FF" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#1D63AD" stopOpacity="0.5" />
        <stop offset="1" stopColor="#0A2C50" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-red`} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#FFE9EA" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#FF5A5F" stopOpacity="0.9" />
        <stop offset="1" stopColor="#9B0B12" stopOpacity="0.96" />
      </linearGradient>
      <linearGradient id={`${id}-white`} x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.92" />
        <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-text`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#D6E8FF" stopOpacity="0.85" />
      </linearGradient>
      <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      {/* texture « fumée » à l'intérieur du verre */}
      <filter id={`${id}-smoke`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="3" seed="11" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.95  0 0 0 0 1  0 0 0 2.6 -1.15" />
        <feGaussianBlur stdDeviation="0.6" />
      </filter>
      <clipPath id={`${id}-clip`}>
        <path d={BUBBLE} />
      </clipPath>
    </defs>
  )
}

/** Objet central du haut de page : bulle « Hello! » en verre bleu + petite bulle rouge. */
export function GlassBubble({ id, className }: Props) {
  return (
    <svg viewBox="0 0 260 250" className={className} aria-hidden="true">
      <Defs id={id} />
      {/* petite bulle rouge, derrière à droite */}
      <g transform="translate(140 0)">
        <path d={SMALL} fill={`url(#${id}-red)`} />
        <path d={SMALL} fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.6" />
        {[38, 60, 82].map((cx) => (
          <circle key={cx} cx={cx} cy="50" r="6" fill="#fff" fillOpacity="0.92" />
        ))}
        <path d="M26 26c6-8 16-11 26-10" fill="none" stroke={`url(#${id}-shine)`} strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* bulle principale */}
      <g transform="translate(0 22)">
        <path d={BUBBLE} fill={`url(#${id}-blue)`} />
        <path d={BUBBLE} fill={`url(#${id}-core)`} />
        <rect x="20" y="20" width="200" height="200" clipPath={`url(#${id}-clip)`} filter={`url(#${id}-smoke)`} opacity="0.5" />
        <g fill="none" stroke="#EAF3FF" strokeOpacity="0.45" strokeWidth="1.6" filter={`url(#${id}-blur)`}>
          <path d="M60 70c22 10 44-8 64 6s-6 40 12 54" />
          <path d="M52 110c20-10 40 12 60 2s32 6 28 30" />
        </g>
        <text
          x="120"
          y="122"
          textAnchor="middle"
          fontFamily="Inter Tight, Plus Jakarta Sans, sans-serif"
          fontWeight="600"
          fontSize="46"
          letterSpacing="-1.5"
          fill={`url(#${id}-text)`}
        >
          Hello!
        </text>
        <path d={BUBBLE} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
        <path d="M58 52c12-14 32-20 52-18" fill="none" stroke={`url(#${id}-shine)`} strokeWidth="7" strokeLinecap="round" />
        <path d="M34 120c4 18 12 32 24 42" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="184" cy="66" rx="6" ry="13" fill="#fff" fillOpacity="0.55" transform="rotate(35 184 66)" />
      </g>
    </svg>
  )
}

/** Illustrations « verre blanc » des cartes de parcours (sur fond coloré). */
export function LevelArt({ id, kind, className }: Props & { kind: 'debutant' | 'intermediaire' | 'avance' }) {
  const glass = `url(#${id}-white)`
  const stroke = { fill: 'none', stroke: '#fff', strokeOpacity: 0.85, strokeWidth: 2 } as const
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <Defs id={id} />
      {kind === 'debutant' && (
        <g transform="translate(20 10) scale(0.85)">
          <path d={BUBBLE} fill={glass} />
          <path d={BUBBLE} {...stroke} />
          <text x="120" y="122" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="56" fill="#fff">
            Hi!
          </text>
          <path d="M58 52c12-14 32-20 52-18" fill="none" stroke={`url(#${id}-shine)`} strokeWidth="7" strokeLinecap="round" />
        </g>
      )}
      {kind === 'intermediaire' && (
        <>
          <g transform="translate(4 20) scale(0.62)">
            <path d={BUBBLE} fill={glass} />
            <path d={BUBBLE} {...stroke} />
            <text x="120" y="122" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="50" fill="#fff">
              Hi!
            </text>
          </g>
          <g transform="translate(236 92) scale(-0.62 0.62)">
            <path d={BUBBLE} fill={glass} />
            <path d={BUBBLE} {...stroke} />
          </g>
          <text x="162" y="172" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="38" fill="#fff">
            Hey!
          </text>
        </>
      )}
      {kind === 'avance' && (
        <g>
          <circle cx="120" cy="118" r="82" fill={glass} />
          <g {...stroke} strokeOpacity={0.7} strokeWidth={1.6}>
            <circle cx="120" cy="118" r="82" />
            <ellipse cx="120" cy="118" rx="36" ry="82" />
            <ellipse cx="120" cy="118" rx="66" ry="82" />
            <path d="M38 118h164M50 78h140M50 158h140" />
          </g>
          <path d="M62 64c18-22 46-30 72-24" fill="none" stroke={`url(#${id}-shine)`} strokeWidth="7" strokeLinecap="round" />
          <g transform="translate(150 150) scale(0.36)">
            <path d={BUBBLE} fill="#fff" fillOpacity="0.95" />
            <text x="120" y="126" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontWeight="700" fontSize="64" fill="#0f4a85">
              EN
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}
