'use client'

import {
  ArrowRight, ArrowUpRight, BellRing, BookOpenCheck, CalendarCheck, CalendarDays, Check, ChevronLeft, ChevronRight,
  Clock, GraduationCap, KeyRound, Mail, MapPin, MessageCircle, Phone, PlayCircle, Quote, Smartphone, UserCheck, Users, Video,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { LogoImg } from '@/components/Logo'
import { AnimatedText } from '@/components/vitrine/AnimatedText'
import { GlassBubble, LevelArt } from '@/components/vitrine/GlassArt'
import { Header, NAV } from '@/components/vitrine/Header'
import { ScrollReveal } from '@/components/vitrine/ScrollReveal'
import { Tilt } from '@/components/vitrine/Tilt'
import { LEVELS, LESSONS, lessonsOfLevel, modulesOfLevel } from '@/lib/catalog'
import { PHOTOS, SITE } from '@/lib/site'
import type { LevelId } from '@/lib/types'

const d = (s: string) => ({ '--d': s }) as CSSProperties

function SectionHeading({ eyebrow, title, intro, id, highlight }: { eyebrow: string; title: string; intro?: string; id?: string; highlight?: string[] }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p data-reveal className="v-eyebrow">{eyebrow}</p>
      <AnimatedText as="h2" id={id} text={title} highlight={highlight} className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink" />
      {intro && <AnimatedText text={intro} mode="fade" delay={0.25} className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft" />}
    </div>
  )
}

function TrialButton({ className = '', label = "Cours d'essai gratuit", variant = 'blue' }: { className?: string; label?: string; variant?: 'blue' | 'red' | 'light' }) {
  const cls = variant === 'red' ? 'v-btn-red' : variant === 'light' ? 'v-btn-light' : 'v-btn'
  return (
    <a href="#contact" className={`${cls} ${className}`}>
      <span className={`grid size-7 place-items-center rounded-full ${variant === 'light' ? 'bg-tint' : 'bg-white/20'}`}>
        <CalendarDays className="size-3.5" aria-hidden="true" />
      </span>
      {label}
    </a>
  )
}

/* ───────────── Haut de page ───────────── */
const intro = "ACML vous accompagne du premier « Hello » jusqu'à l'aisance professionnelle : des leçons vidéo programmées et un superviseur qui suit chacun de vos progrès."

function Hero() {
  return (
    <section id="accueil" aria-labelledby="hero-title" className="relative overflow-hidden pt-6">
      <div className="container-page relative flex flex-col lg:block lg:h-[clamp(540px,46vw,660px)]">
        {/* Titre — en haut à gauche, la bulle le chevauche */}
        <div className="relative z-10 pt-4 lg:absolute lg:top-8 lg:left-10">
          <AnimatedText
            as="h1"
            id="hero-title"
            trigger="load"
            delay={0.05}
            highlight={['langue']}
            text={[{ text: "Parlez l'anglais", className: 'lg:pl-[1.9em]' }, "comme si c'était", 'votre langue']}
            className="text-[clamp(2.5rem,5.2vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink lg:whitespace-nowrap"
          />
          <p className="hero-anim mt-10 hidden max-w-[20rem] text-[13px] leading-relaxed text-ink-soft lg:block" style={d('0.55s')}>
            {intro}
          </p>
        </div>

        {/* Bulle centrale */}
        <div
          className="hero-anim hero-anim--object pointer-events-none relative z-0 mx-auto mt-4 w-[min(78vw,340px)] lg:absolute lg:top-[15%] lg:left-[37%] lg:mt-0 lg:w-[clamp(300px,27vw,400px)]"
          style={d('0.2s')}
        >
          <div className="absolute inset-x-10 -bottom-2 h-10 rounded-full bg-brand-700/25 blur-2xl" aria-hidden="true" />
          <div className="absolute -top-6 right-6 size-24 rounded-full bg-accent-600/15 blur-2xl" aria-hidden="true" />
          <Tilt>
            <GlassBubble id="hero-bubble" className="animate-float relative w-full drop-shadow-[0_30px_40px_rgba(10,44,80,0.28)]" />
          </Tilt>
        </div>

        {/* Bloc droit */}
        <div className="relative z-10 mt-4 lg:absolute lg:top-[42%] lg:right-10 lg:mt-0">
          <AnimatedText
            trigger="load"
            delay={0.55}
            highlight={['passion']}
            text={['Avec aisance,', 'avec passion']}
            className="text-[clamp(2.3rem,4.4vw,3.9rem)] font-medium leading-[1] tracking-[-0.035em] text-ink"
          />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft lg:hidden">{intro}</p>
          <div className="hero-anim mt-7 flex flex-wrap items-center gap-3" style={d('0.9s')}>
            <TrialButton />
            <a href="#parcours" className="v-btn-outline">
              Nos parcours <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Filigrane */}
      <p
        aria-hidden="true"
        style={d('0.6s')}
        className="hero-anim hero-anim--mark pointer-events-none mt-12 select-none whitespace-nowrap text-center text-[clamp(2rem,6.3vw,6.2rem)] font-medium leading-none tracking-[-0.04em] text-tint lg:-mt-[0.7em]"
      >
        ACML — L&apos;anglais comme ma langue
      </p>
    </section>
  )
}

/* ───────────── À propos ───────────── */
function About() {
  const stats = [
    { value: '3', label: 'niveaux, de Débutant à Avancé' },
    { value: `${LESSONS.length}+`, label: 'leçons vidéo séquencées' },
    { value: '1', label: 'superviseur dédié par classe' },
    { value: '100 %', label: 'accessible sur téléphone' },
  ]
  return (
    <section id="a-propos" aria-labelledby="about-title" className="container-page scroll-mt-24 py-10 lg:py-16">
      <div data-reveal="zoom" className="about-panel relative overflow-hidden rounded-[28px] px-6 pb-6 pt-10 text-white sm:px-10 lg:min-h-[580px] lg:px-12 lg:pt-12">
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="max-w-2xl">
            <p className="v-eyebrow !text-white/70">À propos</p>
            <AnimatedText
              as="h2"
              id="about-title"
              text={['Nous n’enseignons pas seulement,', 'nous accompagnons.']}
              className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.04] tracking-[-0.03em]"
            />
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/80">
              ACML – L&apos;Anglais Comme Ma Langue – est née d&apos;une conviction : l&apos;anglais s&apos;apprend avec régularité, de bons supports et
              quelqu&apos;un qui croit en vous. Notre plateforme réunit les trois, sur téléphone comme sur ordinateur.
            </p>
            <ul className="mt-6 grid gap-2 text-[13.5px] text-white/90 sm:grid-cols-2">
              {['Parcours clair et progressif', 'Vidéos programmées chaque semaine', 'Superviseur qui intervient au bon moment', 'Quiz, fiches PDF et vocabulaire'].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-accent-600"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <img src={PHOTOS.classroom} alt="Formatrice ACML en classe" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-white/20" />
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-md">
              <p className="font-script text-2xl leading-none">{SITE.tagline}</p>
            </div>
          </div>
        </div>

        <ul data-reveal-stagger className="relative mt-12 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
              <p className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-medium leading-none tracking-tight">{s.value}</p>
              <p className="mt-3 text-[13px] text-white/80">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── Parcours (cartes accordéon) ───────────── */
const CARD_TONE: Record<LevelId, string> = { debutant: '', intermediaire: 'level-card--red', avance: 'level-card--deep' }

function Programs() {
  const pick = (id: LevelId) => window.dispatchEvent(new CustomEvent('acml:niveau', { detail: id }))
  return (
    <section id="parcours" aria-labelledby="parcours-title" className="container-page scroll-mt-24 py-16 lg:py-24">
      <SectionHeading
        id="parcours-title"
        eyebrow="Nos parcours"
        title="Trois niveaux, un seul objectif : parler"
        highlight={['parler']}
        intro="Chaque niveau est découpé en modules puis en leçons vidéo, dans un ordre pensé pour que chaque leçon prépare la suivante."
      />

      <ul data-reveal className="mt-12 flex flex-col gap-3 sm:grid sm:grid-cols-3 lg:flex lg:flex-row lg:gap-3.5">
        {LEVELS.map((lvl) => {
          const mods = modulesOfLevel(lvl.id)
          const lessons = lessonsOfLevel(lvl.id)
          const minutes = Math.round(lessons.reduce((a, l) => a + l.duration, 0) / 60)
          return (
            <li key={lvl.id} className="level-item">
              <a href="#contact" onClick={() => pick(lvl.id)} className={`level-card ${CARD_TONE[lvl.id]}`} aria-label={`Niveau ${lvl.name} : réserver un cours d'essai`}>
                <div className="level-art">
                  <LevelArt kind={lvl.id} id={`lvl-${lvl.id}`} className="h-full w-auto" />
                </div>
                <div className="level-detail">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-medium leading-snug">{lvl.objectif}</p>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-[12.5px] text-white/90">
                    {mods.map((m) => (
                      <li key={m.id} className="flex items-center gap-2"><Check className="size-3.5 shrink-0" aria-hidden="true" />{m.title}</li>
                    ))}
                  </ul>
                  <p className="mt-auto text-[12px] text-white/80">
                    {lessons.length} leçons · {Math.floor(minutes / 60)} h {String(minutes % 60).padStart(2, '0')} de vidéo
                  </p>
                </div>
                <div className="level-title">
                  <p>{lvl.name}</p>
                  <p className="mt-1.5 text-[12.5px] font-normal leading-snug text-white/85 lg:hidden">{lvl.public}</p>
                </div>
              </a>
            </li>
          )
        })}
      </ul>

      <div data-reveal className="mt-12 flex flex-wrap justify-center gap-3">
        <TrialButton />
        <Link href="/rejoindre" className="v-btn-outline">J&apos;ai un code de classe <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  )
}

/* ───────────── Bande de phrases ───────────── */
const PHRASES = [
  'Hello, how are you?', 'Nice to meet you!', 'Where are you from?', "I'd like a coffee, please.",
  'Could you repeat that?', "Let's schedule a meeting.", 'I totally agree with you.', 'See you tomorrow!',
]

function PhraseChip({ text, i }: { text: string; i: number }) {
  return (
    <li className="flex h-16 shrink-0 items-center gap-3 rounded-2xl border border-line bg-white px-6">
      <MessageCircle className={`size-5 ${i % 2 ? 'text-accent-600' : 'text-brand-700'}`} aria-hidden="true" />
      <span className="whitespace-nowrap text-[15px] font-medium text-ink">{text}</span>
    </li>
  )
}

function PhrasesBand() {
  return (
    <section aria-labelledby="phrases-title" className="overflow-hidden bg-surface py-12 lg:py-14">
      <div data-reveal className="container-page flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="v-eyebrow">Speak up</p>
          <AnimatedText as="h2" id="phrases-title" text="Les phrases que vous direz bientôt" highlight={['bientôt']} className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-medium tracking-tight text-ink" />
        </div>
        <p className="max-w-xs text-[13.5px] text-ink-soft">Des situations réelles du quotidien, du marché à la salle de réunion.</p>
      </div>
      <div data-reveal className="phrases-marquee mt-8">
        {/* liste doublée pour un défilement continu ; la copie est masquée aux lecteurs d'écran */}
        <ul className="phrases-track flex w-max gap-4 pr-4">
          {PHRASES.map((p, i) => <PhraseChip key={p} text={p} i={i} />)}
        </ul>
        <ul className="phrases-track flex w-max gap-4 pr-4" aria-hidden="true">
          {PHRASES.map((p, i) => <PhraseChip key={p} text={p} i={i} />)}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── Méthode & espaces ───────────── */
function Method() {
  const steps = [
    [KeyRound, 'Recevez votre code', 'Votre superviseur vous envoie un lien ou un code de classe.'],
    [UserCheck, 'Créez votre compte', 'En une minute, avec votre e-mail ou votre numéro de téléphone.'],
    [CalendarCheck, 'Suivez votre calendrier', 'Chaque nouvelle vidéo se débloque à la date prévue.'],
    [BookOpenCheck, 'Progressez, validez', 'Regardez la leçon, téléchargez la fiche, passez le quiz.'],
  ] as const
  const features = [
    [Video, 'Reprise automatique'],
    [BellRing, 'Rappels'],
    [Smartphone, 'Pensé mobile'],
    [Clock, 'Leçons de 6 à 14 min'],
  ] as const
  const spaces = [
    {
      icon: GraduationCap, title: 'Espace étudiant', tone: 'video-thumb', photo: PHOTOS.online,
      items: ['Prochaine vidéo à regarder', 'Calendrier de mes leçons', 'Quiz, fiches et vocabulaire', 'Badges et séries de jours'],
    },
    {
      icon: Users, title: 'Espace superviseur', tone: 'red-panel', photo: PHOTOS.group,
      items: ['Programmation en un clic', 'Suivi de chaque élève', "Journal d'activité et alertes", 'Annonces et exports'],
    },
  ]
  return (
    <section id="methode" aria-labelledby="methode-title" className="container-page scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-reveal className="v-eyebrow">Notre méthode</p>
          <AnimatedText
            as="h2"
            id="methode-title"
            text={["Simple pour l'élève,", 'puissant pour le superviseur']}
            highlight={['simple']}
            className="mt-3 text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
          />
          <AnimatedText
            mode="fade"
            delay={0.2}
            text="La régularité fait la différence : la plateforme programme vos leçons, vous rappelle les échéances et prévient votre superviseur si vous décrochez."
            className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft"
          />
          <ul data-reveal-stagger className="mt-7 flex flex-wrap gap-2">
            {features.map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink">
                <Icon className="size-4 text-accent-600" aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
        </div>

        <ol data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
          {steps.map(([Icon, title, text], i) => (
            <li key={title} className="lift relative overflow-hidden rounded-3xl border border-line bg-white p-6">
              <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 text-[7rem] font-medium leading-none tracking-tighter text-tint">
                {i + 1}
              </span>
              <span className={`relative grid size-11 place-items-center rounded-2xl ${i % 2 ? 'bg-red-tint text-accent-600' : 'bg-tint text-brand-700'}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="relative mt-8 text-[19px] font-medium tracking-tight text-ink">{title}</h3>
              <p className="relative mt-1.5 text-[14px] leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Les deux espaces */}
      <div data-reveal-stagger className="mt-16 grid gap-3 lg:grid-cols-2">
        {spaces.map((s) => (
          <article
            key={s.title}
            className={`relative overflow-hidden rounded-[28px] p-6 text-white sm:p-8 ${s.tone === 'video-thumb' ? 'video-thumb' : 'bg-[linear-gradient(165deg,#ff5a5f_0%,#e3131b_50%,#8f0a10_100%)]'}`}
          >
            <div className="relative flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur"><s.icon className="size-6" aria-hidden="true" /></span>
              <img src={s.photo} alt="" loading="lazy" className="hidden h-24 w-36 rounded-2xl object-cover ring-1 ring-white/25 sm:block" />
            </div>
            <h3 className="relative mt-6 text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium tracking-tight">{s.title}</h3>
            <ul className="relative mt-4 grid gap-2 text-[14px] text-white/90 sm:grid-cols-2">
              {s.items.map((i) => (
                <li key={i} className="flex items-center gap-2"><Check className="size-4 shrink-0" aria-hidden="true" />{i}</li>
              ))}
            </ul>
            <Link href="/connexion" className="v-btn-light relative mt-7">
              <span className="grid size-7 place-items-center rounded-full bg-tint"><PlayCircle className="size-3.5" aria-hidden="true" /></span>
              Accéder à mon espace
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Avis ───────────── */
// ⚠️ Témoignages d'exemple : à remplacer par de vrais avis d'apprenants ACML.
const TESTIMONIALS = [
  { name: 'Aïcha S.', role: 'Étudiante · Débutant', text: "Je n'osais pas parler anglais. Avec les vidéos programmées et les messages de ma superviseure, je me présente maintenant sans stress." },
  { name: 'Rachidi A.', role: 'Commercial · Intermédiaire', text: 'Les leçons sont courtes, je les regarde sur mon téléphone pendant la pause. Le calendrier m’oblige à rester régulier.' },
  { name: 'Esther G.', role: 'Étudiante en master · Avancé', text: "Les modules d'anglais académique m'ont aidée à préparer ma soutenance. Les quiz permettent de vérifier qu'on a bien compris." },
  { name: 'Mariam B.', role: 'Entrepreneure · Débutant', text: 'Même avec une petite connexion, les vidéos passent bien. Et la reprise automatique, c’est génial !' },
]

function Testimonials() {
  const [i, setI] = useState(0)
  const n = TESTIMONIALS.length
  return (
    <section id="temoignages" aria-labelledby="avis-title" className="scroll-mt-24 bg-surface py-16 lg:py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p data-reveal className="v-eyebrow">Avis</p>
            <AnimatedText as="h2" id="avis-title" text="Ils parlent anglais avec ACML" highlight={['anglais']} className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink" />
          </div>
          <div data-reveal className="flex gap-2">
            <button type="button" className="round-btn" onClick={() => setI((i - 1 + n) % n)} aria-label="Avis précédent"><ChevronLeft className="size-4" /></button>
            <button type="button" className="round-btn" onClick={() => setI((i + 1) % n)} aria-label="Avis suivant"><ChevronRight className="size-4" /></button>
          </div>
        </div>
        <div data-reveal className="mt-10 grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((k) => {
            const t = TESTIMONIALS[(i + k) % n]
            const featured = k === 0
            return (
              <figure key={t.name} className={`flex flex-col rounded-3xl p-6 sm:p-7 ${k > 0 ? 'hidden md:flex' : ''} ${featured ? 'video-thumb text-white' : 'lift border border-line bg-white'}`}>
                <Quote className={`size-8 ${featured ? 'text-white/40' : 'text-accent-600/25'}`} fill="currentColor" aria-hidden="true" />
                <blockquote className={`mt-4 text-[16px] leading-relaxed ${featured ? 'text-white' : 'text-ink'}`}>« {t.text} »</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <span className={`grid size-10 place-items-center rounded-full text-sm font-semibold ${featured ? 'bg-white text-brand-900' : 'bg-tint text-brand-700'}`}>{t.name[0]}</span>
                  <span>
                    <span className="block text-[14px] font-medium">{t.name}</span>
                    <span className={`block text-[12.5px] ${featured ? 'text-white/75' : 'text-ink-soft'}`}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
        <div className="mt-6 flex justify-center gap-1.5" aria-hidden="true">
          {TESTIMONIALS.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-accent-600' : 'w-1.5 bg-line'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Cours d'essai / contact ───────────── */
function Contact() {
  const [sent, setSent] = useState(false)
  const [level, setLevel] = useState<LevelId | 'inconnu'>('debutant')

  // un clic sur une carte de parcours présélectionne le niveau
  useEffect(() => {
    const onPick = (e: Event) => setLevel((e as CustomEvent<LevelId>).detail)
    window.addEventListener('acml:niveau', onPick)
    return () => window.removeEventListener('acml:niveau', onPick)
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const info = [
    [Phone, SITE.phone],
    [Mail, SITE.email],
    [MapPin, SITE.address],
    [Clock, SITE.hours],
  ] as const
  const choices: { id: LevelId | 'inconnu'; name: string }[] = [...LEVELS.map((l) => ({ id: l.id, name: l.name })), { id: 'inconnu', name: 'Je ne sais pas' }]

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-page scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p data-reveal className="v-eyebrow">Cours d&apos;essai</p>
          <AnimatedText
            as="h2"
            id="contact-title"
            text={['Réservez votre', "cours d'essai gratuit"]}
            highlight={['gratuit']}
            className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
          />
          <AnimatedText mode="fade" delay={0.2} text="Faites le premier pas : nous évaluons votre niveau et vous orientons vers la classe qui vous correspond. Réponse sous 24 h." className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft" />
          <ul data-reveal-stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {info.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-[14px] text-ink">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tint text-brand-700"><Icon className="size-4" aria-hidden="true" /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="right" className="rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(10,44,80,0.45)] sm:p-9">
          {sent ? (
            <div className="grid h-full min-h-80 place-items-center text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-tint text-brand-700"><Check className="size-7" aria-hidden="true" /></span>
                <h3 className="mt-5 text-[24px] font-medium tracking-tight text-ink">Demande envoyée !</h3>
                <p className="mt-2 text-[14px] text-ink-soft">L&apos;équipe ACML vous recontacte très vite. See you soon!</p>
                <button type="button" className="v-btn-outline mt-6" onClick={() => setSent(false)}>Nouvelle demande</button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-[12px] font-medium text-ink-soft">Nom complet</span>
                <input required className="line-input" placeholder="Ex. Koffi Agbo" autoComplete="name" />
              </label>
              <label>
                <span className="text-[12px] font-medium text-ink-soft">Téléphone / WhatsApp</span>
                <input required type="tel" className="line-input" placeholder="+229 …" autoComplete="tel" />
              </label>
              <label>
                <span className="text-[12px] font-medium text-ink-soft">E-mail</span>
                <input type="email" className="line-input" placeholder="vous@exemple.com" autoComplete="email" />
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-[12px] font-medium text-ink-soft">Votre niveau estimé</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {choices.map((l) => (
                    <label key={l.id} className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 ${level === l.id ? 'border-brand-700 bg-brand-700 text-white' : 'border-line text-ink hover:border-brand-700/50'}`}>
                      <input type="radio" name="niveau" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} className="sr-only" />
                      {l.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="sm:col-span-2">
                <span className="text-[12px] font-medium text-ink-soft">Votre objectif</span>
                <textarea rows={3} className="line-input resize-none" placeholder="Voyage, travail, études, examen…" />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                <p className="max-w-[16rem] text-[12px] text-ink-soft">Vos informations servent uniquement à vous recontacter.</p>
                <button type="submit" className="v-btn-red">
                  <span className="grid size-7 place-items-center rounded-full bg-white/20"><ArrowRight className="size-3.5" aria-hidden="true" /></span>
                  Réserver mon cours
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Pied de page ───────────── */
function Footer() {
  return (
    <footer className="footer-panel relative overflow-hidden text-white">
      <p aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-4 select-none text-[clamp(6rem,18vw,16rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.05]">
        ACML
      </p>
      <div data-reveal-stagger className="container-page relative grid gap-10 pt-14 pb-8 lg:grid-cols-[auto_1fr] lg:gap-x-14 xl:grid-cols-[auto_auto_1fr]">
        <div>
          <a href="#accueil" className="inline-flex rounded-xl bg-white px-3 py-2" aria-label="ACML – haut de page">
            <LogoImg className="h-9" />
          </a>
          <p className="mt-4 font-script text-2xl text-white/90">{SITE.tagline}</p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px] font-medium sm:grid-cols-4 lg:grid-cols-2">
            {NAV.map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="link-underline">{item.label}</a></li>
            ))}
            <li><Link href="/connexion" className="link-underline">Se connecter</Link></li>
            <li><Link href="/rejoindre" className="link-underline">Rejoindre une classe</Link></li>
          </ul>
        </nav>

        <div className="grid gap-8 text-[13px] sm:grid-cols-3 lg:col-span-2 lg:gap-12 xl:col-span-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">Nous contacter</p>
            <ul className="mt-3 space-y-1.5">
              <li>{SITE.phone}</li>
              <li><a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a></li>
              <li className="text-white/80">{SITE.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">Horaires</p>
            <p className="mt-3">{SITE.hours}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">Plateforme</p>
            <ul className="mt-3 space-y-1.5">
              <li><Link href="/connexion" className="hover:underline">Espace étudiant</Link></li>
              <li><Link href="/connexion" className="hover:underline">Espace superviseur</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-page relative flex flex-col gap-3 border-t border-white/15 py-6 text-[12px] text-white/80 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ACML – L&apos;Anglais Comme Ma Langue</p>
        <p>Données des étudiants utilisées uniquement pour le suivi pédagogique.</p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="vitrine">
      <ScrollReveal />
      <Header />
      <main id="contenu">
        <Hero />
        <About />
        <Programs />
        <PhrasesBand />
        <Method />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
