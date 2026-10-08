'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionHeading from './SectionHeading';
import { ACCENT } from './Projects';
import { buildingNext, skillOrbits } from '@/data/content';

// Rings + items come from `skillOrbits`, the side list from `buildingNext` (src/data/content.ts)

const RING_RADIUS = [0.2, 0.33, 0.47]; // fraction of stage size, inner → outer
const RING_SPEED = [28, 42, 60]; // seconds per revolution

export default function Skills() {
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(520);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const small = size < 420;

  return (
    <section id="stack" className="section">
      <SectionHeading
        index="03"
        kicker="Skills & Stack"
        title={
          <>
            The orbit I live in, <span className="text-gradient">and what I&apos;m building next.</span>
          </>
        }
        subtitle="Frontend roots, motion and 3D in the middle, AI on the outer edge, and the outer ring keeps getting bigger."
      />

      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        {/* ORBIT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          ref={stage}
          className="orbit-stage relative mx-auto aspect-square w-full max-w-[560px]"
        >
          {/* core */}
          <div className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan/30 via-neon-violet/30 to-neon-pink/30 shadow-[0_0_80px_-10px_rgba(167,139,250,0.8)] backdrop-blur">
            <div className="absolute inset-0 animate-pulse rounded-full border border-white/20" />
            <span className="font-mono text-[11px] text-white sm:text-sm">next()</span>
          </div>

          {skillOrbits.map((ring, ri) => {
            const r = (RING_RADIUS[ri] ?? 0.47) * size;
            const a = ACCENT[ring.accent];
            const dimmed = active !== null && active !== ri;
            return (
              <div key={ring.label} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: dimmed ? 0.25 : 1 }}>
                {/* ring outline */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
                  style={{ width: r * 2, height: r * 2 }}
                />
                {/* rotating layer */}
                <div
                  className="orbit-ring absolute inset-0"
                  style={
                    {
                      '--dur': `${RING_SPEED[ri] ?? 60}s`,
                      '--dir': ri % 2 ? 'reverse' : 'normal',
                    } as React.CSSProperties
                  }
                >
                  {ring.items.map((item, ii) => {
                    const angle = (360 / ring.items.length) * ii + ri * 20;
                    return (
                      <div
                        key={item}
                        className="absolute left-1/2 top-1/2 h-0 w-0"
                        style={{ transform: `rotate(${angle}deg) translateX(${r}px) rotate(${-angle}deg)` }}
                      >
                        <div className="absolute -translate-x-1/2 -translate-y-1/2">
                          {/* counter-spin keeps labels upright */}
                          <div
                            className="orbit-counter"
                            style={
                              {
                                '--dur': `${RING_SPEED[ri] ?? 60}s`,
                                '--dir': ri % 2 ? 'reverse' : 'normal',
                              } as React.CSSProperties
                            }
                          >
                            <span
                              className={`block whitespace-nowrap rounded-full border border-white/15 bg-ink-900/80 font-mono backdrop-blur transition-transform hover:scale-110 ${a.text} ${
                                small ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-xs'
                              }`}
                              style={{ boxShadow: `0 0 18px -6px ${a.hex}` }}
                            >
                              {item}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* LEGEND + BUILDING NEXT */}
        <div>
          <div className="mb-10 flex flex-wrap gap-3">
            {skillOrbits.map((ring, ri) => (
              <button
                key={ring.label}
                onMouseEnter={() => setActive(ri)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(ri)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((v) => (v === ri ? null : ri))}
                className={`rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-white/30 ${ACCENT[ring.accent].text}`}
              >
                ● {ring.label}
              </button>
            ))}
          </div>

          <p className="kicker mb-6">// building next</p>
          <ul className="space-y-4">
            {buildingNext.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass group flex items-start gap-4 p-5 transition-colors hover:border-neon-violet/40"
              >
                <span className="mt-1 font-mono text-xs text-neon-violet">0{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-white">{b.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{b.detail}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
