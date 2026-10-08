'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from './SectionHeading';
import { timeline, type TimelineKind } from '@/data/content';

// Timeline entries come from `timeline` in src/data/content.ts

const KIND_STYLE: Record<TimelineKind, { label: string; dot: string; text: string }> = {
  join: { label: 'Joined', dot: 'bg-neon-cyan shadow-[0_0_18px_#22d3ee]', text: 'text-neon-cyan' },
  milestone: { label: 'Milestone', dot: 'bg-neon-lime shadow-[0_0_18px_#a3e635]', text: 'text-neon-lime' },
  promotion: { label: 'Promotion', dot: 'bg-neon-violet shadow-[0_0_18px_#a78bfa]', text: 'text-neon-violet' },
  project: { label: 'Project', dot: 'bg-neon-pink shadow-[0_0_18px_#f472b6]', text: 'text-neon-pink' },
  farewell: { label: 'Farewell', dot: 'bg-white shadow-[0_0_24px_#fff]', text: 'text-white' },
};

export default function Timeline() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // the glowing line "draws" itself as you scroll
      gsap.fromTo(
        '.tl-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tl-list', start: 'top 65%', end: 'bottom 65%', scrub: 0.6 },
        }
      );

      const mobile = window.innerWidth < 768;
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        const fromX = mobile ? 40 : item.dataset.side === 'left' ? -70 : 70;
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none reverse' } })
          .from(item.querySelector('.tl-dot'), { scale: 0, duration: 0.45, ease: 'back.out(3)' })
          .from(item.querySelector('.tl-card'), { opacity: 0, x: fromX, duration: 0.8, ease: 'power3.out' }, '<0.05')
          .from(item.querySelectorAll('.tl-stagger'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.5 }, '<0.25');
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="section" ref={root}>
      <SectionHeading
        index="01"
        kicker="The Journey"
        title={
          <>
            Four years, <span className="text-gradient">one commit at a time.</span>
          </>
        }
        subtitle="From the first git clone to the final push: the milestones, promotions and launches that shaped me."
      />

      <ol className="tl-list relative">
        {/* track + animated progress line */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 md:left-1/2" />
        <div className="tl-progress absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-pink md:left-1/2" />

        {timeline.map((e, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          const k = KIND_STYLE[e.kind];
          return (
            <li key={e.date + e.title} data-side={side} className="tl-item relative mb-12 pl-10 md:mb-16 md:grid md:grid-cols-2 md:pl-0">
              <span
                className={`tl-dot absolute left-[6px] top-6 h-[11px] w-[11px] rounded-full md:left-1/2 md:-translate-x-1/2 ${k.dot}`}
              />
              <div className={side === 'left' ? 'md:pr-14' : 'md:col-start-2 md:pl-14'}>
                <article className={`tl-card glass group p-6 transition-colors hover:border-white/20 sm:p-7 ${side === 'left' ? 'md:text-right' : ''}`}>
                  <div className={`tl-stagger mb-3 flex items-center gap-3 font-mono text-xs ${side === 'left' ? 'md:justify-end' : ''}`}>
                    <span className="text-slate-400">{e.date}</span>
                    <span className={`rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-widest ${k.text}`}>
                      {k.label}
                    </span>
                  </div>
                  <h3 className="tl-stagger text-xl font-semibold text-white sm:text-2xl">{e.title}</h3>
                  <p className="tl-stagger mt-3 leading-relaxed text-slate-400">{e.description}</p>
                  {e.tags && (
                    <div className={`tl-stagger mt-4 flex flex-wrap gap-2 ${side === 'left' ? 'md:justify-end' : ''}`}>
                      {e.tags.map((t) => (
                        <span key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
