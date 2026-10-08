'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrambleText from './ScrambleText';
import { bootLines, heroHeadline, heroStats, profile } from '@/data/content';

// Three.js only runs in the browser — load it client-side, after first paint.
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

export default function Hero() {
  const [lines, setLines] = useState(0); // boot lines printed so far
  const [progress, setProgress] = useState(0);
  const [headlineStep, setHeadlineStep] = useState(0); // headline lines fully decoded
  const booted = lines >= bootLines.length;

  // 1) print boot lines one by one
  useEffect(() => {
    if (booted) return;
    const id = setTimeout(() => setLines((n) => n + 1), lines === 0 ? 400 : 380);
    return () => clearTimeout(id);
  }, [lines, booted]);

  // 2) loading bar fills alongside the boot log
  useEffect(() => {
    if (progress >= 100) return;
    const id = setTimeout(() => setProgress((p) => Math.min(100, p + Math.random() * 6 + 2)), 70);
    return () => clearTimeout(id);
  }, [progress]);

  const ready = progress >= 100 && headlineStep >= heroHeadline.length;

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <ParticleField />
      {/* vignette so text stays legible over the particles */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,10,0.55)_55%,#05060a_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 pt-28 sm:px-8">
        {/* boot log */}
        <div className="mb-8 min-h-[6.5rem] font-mono text-[11px] leading-relaxed text-slate-500 sm:text-xs">
          {bootLines.slice(0, lines).map((l, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-neon-violet">&gt;</span> {l} <span className="text-neon-lime">[ OK ]</span>
            </motion.p>
          ))}
          {!booted && <span className="animate-blink text-neon-cyan">▋</span>}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: booted ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="kicker mb-5"
        >
          {profile.role} · {profile.company}
        </motion.p>

        <h1 className="max-w-6xl text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[1.02] tracking-tight text-white">
          {heroHeadline.map((line, i) => (
            <span key={line} className={`block [text-wrap:balance] ${i === heroHeadline.length - 1 ? 'text-gradient pb-2' : ''}`}>
              <ScrambleText
                text={line}
                start={booted && headlineStep >= i}
                onDone={() => setHeadlineStep((s) => Math.max(s, i + 1))}
              />
            </span>
          ))}
        </h1>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {heroStats.map((s) => (
            <div key={s.label} className="border-l border-white/10 pl-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{s.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* boot-up loader → scroll prompt */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-5">
        {!ready ? (
          <div className="w-56 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <div className="mb-2 flex justify-between">
              <span>Booting</span>
              <span className="text-neon-cyan">{Math.floor(progress)}%</span>
            </div>
            <div className="h-[2px] w-full overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <motion.a
            href="#journey"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col items-center gap-3 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-slate-400 hover:text-neon-cyan"
          >
            <span>
              <span className="text-neon-lime">System ready</span> — scroll to begin
            </span>
            <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5 group-hover:border-neon-cyan">
              <span className="h-2 w-[2px] animate-float rounded bg-neon-cyan" />
            </span>
          </motion.a>
        )}
      </div>
    </section>
  );
}
