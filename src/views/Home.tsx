'use client'

import {
  ArrowRight, BarChart3, BellRing, BookOpenCheck, CalendarDays, CalendarCheck, Check, ChevronLeft, ChevronRight,
  GraduationCap, KeyRound, MessageCircle, PlayCircle, Quote, Smartphone, Sparkles, Star, UserCheck, Users, Video, Wifi,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { LEVELS, lessonsOfLevel, LESSONS, modulesOfLevel } from '../lib/catalog'
import { PHOTOS, SITE } from '../lib/site'

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <div className={`grid place-items-center bg-gradient-to-br from-brand-600 to-brand-900 text-white/70 ${className}`}>
      <GraduationCap size={64} />
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
  )
}

function SectionTitle({ eyebrow, title, children, center = false }: { eyebrow: string; title: string; children?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="eyebrow"><span className="h-0.5 w-6 rounded bg-accent-600" />{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-brand-50" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-accent-50" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div className="animate-fade-up">
          <span className="eyebrow"><span className="h-0.5 w-6 rounded bg-accent-600" />Façonnez votre avenir</span>
          <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Parlez anglais.
            <br />
            <span className="text-brand-700">Ouvrez le monde.</span>
          </h1>
          <p className="mt-3 font-script text-3xl text-brand-600 sm:text-4xl">{SITE.tagline}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Des leçons vidéo courtes et programmées, un superviseur qui suit chacun de vos progrès, trois niveaux pour passer
            du premier « Hello » à l'aisance professionnelle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#parcours" className="btn-primary px-6 py-3">Découvrir nos parcours <ArrowRight size={16} /></a>
            <Link href="/connexion" className="btn-ghost px-6 py-3"><PlayCircle size={18} className="text-accent-600" /> Accéder à mon espace</Link>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {['AS', 'KA', 'MB', 'GA'].map((x, i) => (
                <span key={x} className={`grid size-9 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-white ${['bg-brand-700', 'bg-accent-600', 'bg-emerald-600', 'bg-amber-500'][i]}`}>{x}</span>
              ))}
            </div>
            <p className="text-sm text-slate-600"><b className="text-slate-900">Apprenez à votre rythme</b>, accompagné à chaque étape.</p>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:.15s]">
          <div className="absolute -inset-3 -z-0 rotate-3 rounded-[2rem] bg-brand-700" />
          <Photo src={PHOTOS.hero} alt="Étudiante suivant un cours d'anglais en ligne" className="relative aspect-[4/3.6] w-full rounded-[2rem] shadow-2xl" />
          <div className="absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-xl sm:-left-8">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-50 text-accent-600"><Video size={22} /></span>
            <div>
              <p className="text-xl font-extrabold leading-none text-brand-900">{LESSONS.length}+</p>
              <p className="text-xs font-medium text-slate-500">leçons vidéo</p>
            </div>
          </div>
          <div className="absolute -right-2 top-8 rounded-2xl bg-white p-4 text-center shadow-xl sm:-right-6">
            <p className="text-3xl font-extrabold leading-none text-brand-700">3</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">niveaux</p>
            <div className="mt-1 flex justify-center text-amber-400">{[0, 1, 2].map((i) => <Star key={i} size={11} fill="currentColor" />)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Bandeau chiffres ───────────── */
function StatsBand() {
  const items = [
    [GraduationCap, '3 niveaux', 'Débutant → Avancé'],
    [Video, `${LESSONS.length} leçons`, 'Vidéos courtes et séquencées'],
    [UserCheck, '1 superviseur', 'Dédié à chaque classe'],
    [Smartphone, '100 % mobile', 'Téléphone, tablette, ordinateur'],
  ] as const
  return (
    <section className="bg-brand-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
        {items.map(([Icon, big, small]) => (
          <div key={big} className="flex items-center gap-4 py-7 lg:justify-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-white"><Icon size={24} /></span>
            <div>
              <p className="text-lg font-extrabold text-white sm:text-xl">{big}</p>
              <p className="text-xs text-brand-200 sm:text-sm">{small}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Parcours ───────────── */
function Programs() {
  const icons = [Sparkles, MessageCircle, BarChart3]
  return (
    <section id="parcours" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Nos parcours" title="Trois niveaux, un seul objectif : parler">
            Chaque niveau est découpé en modules puis en leçons vidéo. L'ordre est pensé par ACML pour que chaque leçon prépare la suivante.
          </SectionTitle>
          <Link href="/rejoindre" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:gap-2.5 transition-all">
            Rejoindre une classe <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {LEVELS.map((lvl, i) => {
            const Icon = icons[i]
            const mods = modulesOfLevel(lvl.id)
            const minutes = Math.round(lessonsOfLevel(lvl.id).reduce((a, l) => a + l.duration, 0) / 60)
            return (
              <article key={lvl.id} className="card group relative flex flex-col overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/5">
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: lvl.color }} />
                <span className="grid size-12 place-items-center rounded-2xl" style={{ background: `${lvl.color}14`, color: lvl.color }}>
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-brand-900">{lvl.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{lvl.public}</p>
                <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-700">{lvl.objectif}</p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
                  {mods.map((m) => (
                    <li key={m.id} className="flex items-center gap-2"><Check size={15} className="shrink-0 text-emerald-600" />{m.title}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between pt-6 text-xs font-semibold text-slate-500">
                  <span>{lessonsOfLevel(lvl.id).length} leçons · {Math.floor(minutes / 60)} h {String(minutes % 60).padStart(2, '0')} de vidéo</span>
                  <a href="#contact" className="inline-flex items-center gap-1 text-brand-700 group-hover:text-accent-600">Je m'inscris <ArrowRight size={14} /></a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Pourquoi ACML ───────────── */
function WhyUs() {
  const points = [
    'Un parcours clair, du niveau débutant au niveau avancé',
    'Des vidéos programmées pour garder un rythme régulier',
    'Un superviseur qui intervient au bon moment',
    'Quiz, fiches PDF et vocabulaire après chaque leçon',
    'Pensé pour le téléphone et les connexions limitées',
  ]
  return (
    <section id="a-propos" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <Photo src={PHOTOS.classroom} alt="Formatrice ACML en classe" className="aspect-[5/4] w-full rounded-3xl" />
          <div className="absolute -bottom-6 right-6 rounded-2xl bg-accent-600 p-5 text-white shadow-xl shadow-accent-700/30">
            <p className="text-3xl font-extrabold leading-none">100 %</p>
            <p className="mt-1 text-sm font-medium text-accent-100">Suivi personnalisé</p>
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Pourquoi choisir ACML" title="Nous n'enseignons pas seulement, nous accompagnons">
            ACML – L'Anglais Comme Ma Langue – est née d'une conviction : l'anglais s'apprend avec régularité, de bons supports et quelqu'un qui croit en vous. Notre plateforme réunit les trois.
          </SectionTitle>
          <ul className="mt-7 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-slate-700">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-700 text-white"><Check size={12} strokeWidth={3} /></span>
                {p}
              </li>
            ))}
          </ul>
          <a href="#methode" className="btn-primary mt-8 px-6 py-3">Voir notre méthode <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Méthode ───────────── */
function Method() {
  const steps = [
    [KeyRound, 'Recevez votre code', 'Votre superviseur vous envoie un lien ou un code de classe.'],
    [UserCheck, 'Créez votre compte', 'En une minute, avec votre e-mail ou votre numéro de téléphone.'],
    [CalendarCheck, 'Suivez votre calendrier', 'Chaque nouvelle vidéo se débloque à la date prévue.'],
    [BookOpenCheck, 'Progressez, validez', 'Regardez, téléchargez la fiche, passez le quiz.'],
  ] as const
  const features = [
    [Video, 'Lecteur intelligent', 'Reprise automatique là où vous vous êtes arrêté, vitesse réglable.'],
    [CalendarDays, 'Programmation', '« 2 vidéos par semaine, lundi et jeudi » : tout est planifié.'],
    [BellRing, 'Rappels', 'Une nouvelle vidéo ? Un retard ? Vous êtes prévenu.'],
    [Wifi, 'Connexion légère', 'Une qualité vidéo adaptée aux petits débits.'],
  ] as const
  return (
    <section id="methode" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle center eyebrow="Notre méthode" title="Simple pour l'étudiant, puissant pour le superviseur" />
        <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-[repeating-linear-gradient(90deg,#b3d0ee_0_8px,transparent_8px_16px)] lg:block" />
          {steps.map(([Icon, title, text], i) => (
            <li key={title} className="relative text-center">
              <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-white text-brand-700 shadow-lg shadow-brand-900/10 ring-1 ring-slate-100">
                <Icon size={26} />
                <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-accent-600 text-xs font-bold text-white">{i + 1}</span>
              </span>
              <h3 className="mt-5 font-bold text-brand-900">{title}</h3>
              <p className="mx-auto mt-1.5 max-w-60 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 rounded-3xl bg-brand-900 p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col justify-center">
            <span className="eyebrow text-accent-500">La plateforme ACML</span>
            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Votre école d'anglais, dans votre poche</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-200">
              Tableau de bord, calendrier, vidéos, quiz et messagerie avec votre superviseur : tout est réuni dans un espace simple, en français.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/connexion" className="btn-accent">Se connecter</Link>
              <Link href="/rejoindre" className="btn border border-white/20 text-white hover:bg-white/10">J'ai un code de classe</Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map(([Icon, t, d]) => (
              <div key={t} className="rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10">
                <Icon size={22} className="text-accent-500" />
                <p className="mt-3 font-bold text-white">{t}</p>
                <p className="mt-1 text-sm text-brand-200">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Espaces ───────────── */
function Spaces() {
  const spaces = [
    {
      icon: GraduationCap, title: 'Espace étudiant', photo: PHOTOS.online,
      items: ['Prochaine vidéo à regarder', 'Calendrier de mes leçons', 'Quiz, fiches et vocabulaire', 'Badges et séries de jours', 'Messagerie avec mon superviseur'],
    },
    {
      icon: Users, title: 'Espace superviseur', photo: PHOTOS.group,
      items: ['Gestion des classes et invitations', 'Programmation des vidéos en un clic', "Suivi de l'évolution de chaque élève", "Journal d'activité et alertes", 'Annonces, messages et exports'],
    },
  ]
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle center eyebrow="Vos espaces" title="Un compte, un espace adapté à votre rôle" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {spaces.map((s) => (
            <article key={s.title} className="card overflow-hidden">
              <div className="relative h-44">
                <Photo src={s.photo} alt="" className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 to-brand-950/10" />
                <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent-600"><s.icon size={20} /></span>
                  <h3 className="text-xl font-extrabold">{s.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="grid gap-2.5 text-sm text-slate-700 sm:grid-cols-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-brand-600" />{i}</li>
                  ))}
                </ul>
                <Link href="/connexion" className="btn-primary mt-6 w-full sm:w-auto">Accéder à l'{s.title.toLowerCase()} <ArrowRight size={16} /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Témoignages ───────────── */
// ⚠️ Témoignages d'exemple : à remplacer par de vrais avis d'apprenants ACML avant la mise en ligne.
const TESTIMONIALS = [
  { name: 'Aïcha S.', role: 'Étudiante – niveau Débutant', text: "Je n'osais pas parler anglais. Avec les vidéos programmées et les messages de ma superviseure, je me présente maintenant sans stress." },
  { name: 'Rachidi A.', role: 'Commercial – niveau Intermédiaire', text: 'Les leçons sont courtes, je les regarde sur mon téléphone pendant la pause. Le calendrier me force à rester régulier.' },
  { name: 'Esther G.', role: 'Étudiante en master – niveau Avancé', text: "Les modules d'anglais académique m'ont aidée à préparer ma soutenance. Les quiz permettent de vérifier qu'on a bien compris." },
  { name: 'Mariam B.', role: 'Entrepreneure – niveau Débutant', text: 'Même avec une petite connexion, les vidéos passent bien. Et la reprise automatique, c’est génial !' },
]

function Testimonials() {
  const [i, setI] = useState(0)
  const n = TESTIMONIALS.length
  const visible = [0, 1, 2].map((k) => TESTIMONIALS[(i + k) % n])
  return (
    <section id="temoignages" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle center eyebrow="Ils parlent de nous" title="Ce que disent nos apprenants" />
        <div className="relative mt-12">
          <div className="grid gap-5 md:grid-cols-3">
            {visible.map((t, k) => (
              <figure key={t.name} className={`card relative p-6 ${k > 0 ? 'hidden md:block' : ''}`}>
                <Quote size={28} className="text-brand-100" fill="currentColor" />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-slate-700">« {t.text} »</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">{t.name.slice(0, 1)}</span>
                  <div>
                    <p className="text-sm font-bold text-brand-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex text-amber-400">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={12} fill="currentColor" />)}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setI((i - 1 + n) % n)} className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-brand-800 hover:border-brand-500" aria-label="Témoignage précédent"><ChevronLeft size={18} /></button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`Témoignage ${k + 1}`} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-brand-700' : 'w-2 bg-slate-300'}`} />
              ))}
            </div>
            <button onClick={() => setI((i + 1) % n)} className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-brand-800 hover:border-brand-500" aria-label="Témoignage suivant"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Contact / cours d'essai ───────────── */
function Contact() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  return (
    <section id="contact" className="scroll-mt-20 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 lg:grid-cols-2">
          <div className="relative p-8 text-white sm:p-12">
            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/5" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10"><CalendarDays size={28} /></span>
            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">Réservez votre cours d'essai gratuit</h2>
            <p className="mt-3 max-w-md text-brand-100">
              Faites le premier pas : nous évaluons votre niveau et vous orientons vers la classe qui vous correspond.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-brand-100">
              <li className="flex items-center gap-2"><Check size={16} className="text-accent-500" />Test de niveau offert</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-accent-500" />Sans engagement</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-accent-500" />Réponse sous 24 h</li>
            </ul>
            <p className="mt-8 font-script text-3xl text-white/90">{SITE.tagline}</p>
          </div>
          <div className="bg-white p-6 sm:p-10">
            {sent ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={28} /></span>
                  <h3 className="mt-4 text-xl font-extrabold text-brand-900">Demande envoyée !</h3>
                  <p className="mt-2 text-sm text-slate-600">L'équipe ACML vous recontacte très vite. See you soon!</p>
                  <button className="btn-ghost mt-6" onClick={() => setSent(false)}>Nouvelle demande</button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="c-name">Nom complet</label>
                  <input id="c-name" required className="input" placeholder="Ex. Koffi Agbo" />
                </div>
                <div>
                  <label className="label" htmlFor="c-phone">Téléphone / WhatsApp</label>
                  <input id="c-phone" required type="tel" className="input" placeholder="+229 …" />
                </div>
                <div>
                  <label className="label" htmlFor="c-mail">E-mail</label>
                  <input id="c-mail" type="email" className="input" placeholder="vous@exemple.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="c-level">Votre niveau estimé</label>
                  <select id="c-level" className="input" defaultValue="debutant">
                    {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name} – {l.public.toLowerCase()}</option>)}
                    <option value="ne-sais-pas">Je ne sais pas</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="c-msg">Votre objectif</label>
                  <textarea id="c-msg" rows={3} className="input resize-none" placeholder="Voyage, travail, études, examen…" />
                </div>
                <button className="btn-accent sm:col-span-2 py-3">Réserver mon cours d'essai <ArrowRight size={16} /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <Programs />
        <WhyUs />
        <Method />
        <Spaces />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
