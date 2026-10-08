'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import SectionHeading from './SectionHeading';
import { projects, type Accent, type Project } from '@/data/content';

// Project data comes from `projects` in src/data/content.ts

export const ACCENT: Record<Accent, { text: string; border: string; from: string; hex: string }> = {
  cyan: { text: 'text-neon-cyan', border: 'hover:border-neon-cyan/50', from: 'from-neon-cyan/30', hex: '#22d3ee' },
  violet: { text: 'text-neon-violet', border: 'hover:border-neon-violet/50', from: 'from-neon-violet/30', hex: '#a78bfa' },
  pink: { text: 'text-neon-pink', border: 'hover:border-neon-pink/50', from: 'from-neon-pink/30', hex: '#f472b6' },
  lime: { text: 'text-neon-lime', border: 'hover:border-neon-lime/50', from: 'from-neon-lime/30', hex: '#a3e635' },
};

/** Generated visual for projects without a screenshot */
function GeneratedArt({ accent, index }: { accent: Accent; index: number }) {
  const hex = ACCENT[accent].hex;
  return (
    <div className="bg-grid absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${hex}55, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="none">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M0 ${200 - i * 22} C 120 ${120 + index * 18 - i * 10}, 260 ${260 - i * 30}, 400 ${150 - i * 18}`}
            fill="none"
            stroke={hex}
            strokeWidth="1"
            strokeOpacity={0.9 - i * 0.2}
          />
        ))}
      </svg>
    </div>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const pointer = useRef<string>('mouse');
  const a = ACCENT[p.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-[440px] cursor-pointer [perspective:1400px]"
      // desktop: hover flips · touch: tap toggles · keyboard: Enter/Space
      onPointerEnter={(e) => {
        pointer.current = e.pointerType;
        if (e.pointerType === 'mouse') setFlipped(true);
      }}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
      onClick={() => pointer.current !== 'mouse' && setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={`${p.title} — show details`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
        className="preserve-3d relative h-full w-full"
      >
        {/* FRONT */}
        <div className={`glass backface-hidden absolute inset-0 flex flex-col overflow-hidden transition-colors ${a.border}`}>
          <div className="relative h-1/2 border-b border-white/10">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${p.image}`}
                alt={p.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <GeneratedArt accent={p.accent} index={i} />
            )}
            <span className="absolute left-5 top-4 font-mono text-xs text-slate-400">
              {String(i + 1).padStart(2, '0')} · {p.year}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="text-2xl font-semibold text-white">{p.title}</h3>
            <p className="mt-2 text-slate-400">{p.tagline}</p>
            <p className={`mt-auto font-mono text-xs uppercase tracking-widest ${a.text}`}>
              <span className="hidden [@media(hover:hover)]:inline">Hover</span>
              <span className="[@media(hover:hover)]:hidden">Tap</span> to inspect →
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`glass backface-hidden rotate-y-180 absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-br ${a.from} to-transparent p-6 sm:p-7`}
        >
          <p className={`font-mono text-xs uppercase tracking-widest ${a.text}`}>// {p.title}</p>
          <p className="mt-4 leading-relaxed text-slate-200">{p.description}</p>
          <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Impact</p>
            <p className="mt-1 text-sm text-white">{p.impact}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {p.stack.map((t) => (
              <span key={t} className={`rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[11px] ${a.text}`}>
                {t}
              </span>
            ))}
          </div>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`mt-4 font-mono text-xs underline-offset-4 hover:underline ${a.text}`}
            >
              View project ↗
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="built" className="section">
      <SectionHeading
        index="02"
        kicker="What I Built"
        title={
          <>
            Shipped, <span className="text-gradient">not just specced.</span>
          </>
        }
        subtitle="A few things I'm proud to have put into production. Flip a card for the stack and the impact."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
