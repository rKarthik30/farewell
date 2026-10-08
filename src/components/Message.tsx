'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import SectionHeading from './SectionHeading';
import { SIGNOFF_EVENT } from './SignOff';

// The finale never starts on a timer (people read at different speeds):
// the reader starts it with the "Sign off" button under the signature.
import { farewellMessage, profile } from '@/data/content';

// The message text comes from `farewellMessage` in src/data/content.ts

type Phase = 'locked' | 'decrypting' | 'open';

const HEX = '0123456789abcdef';
const randHex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join('');

export default function Message() {
  const [phase, setPhase] = useState<Phase>('locked');
  const [pct, setPct] = useState(0);
  const [noise, setNoise] = useState<string[]>([]);
  const [typed, setTyped] = useState(0);

  const full = useMemo(() => [farewellMessage.greeting, ...farewellMessage.paragraphs].join('\n\n'), []);
  const done = typed >= full.length;

  // decrypt animation
  useEffect(() => {
    if (phase !== 'decrypting') return;
    if (pct >= 100) {
      const id = setTimeout(() => setPhase('open'), 250);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setPct((p) => Math.min(100, p + 4 + Math.random() * 6));
      setNoise(Array.from({ length: 4 }, () => randHex(32)));
    }, 45);
    return () => clearTimeout(id);
  }, [phase, pct]);

  // typewriter: short pauses on punctuation feel more human
  useEffect(() => {
    if (phase !== 'open' || done) return;
    const ch = full[typed - 1];
    const delay = ch === '\n' ? 200 : /[.,!?—]/.test(ch ?? '') ? 90 : 8 + Math.random() * 12;
    const id = setTimeout(() => setTyped((t) => t + 1), delay);
    return () => clearTimeout(id);
  }, [phase, typed, full, done]);

  const unlock = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open');
      setTyped(full.length);
    } else setPhase('decrypting');
  };

  const shown = full.slice(0, typed).split('\n\n');

  return (
    <section id="message" className="section">
      <SectionHeading
        index="04"
        kicker="Message to the Team"
        title={
          <>
            One last <span className="text-gradient">pull request.</span>
          </>
        }
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/40 via-neon-violet/20 to-neon-pink/40 opacity-60 blur-sm" />
        <div className="glass relative min-h-[420px] overflow-hidden !bg-ink-900/80 p-7 sm:p-12">
          {/* window chrome */}
          <div className="mb-8 flex items-center gap-2 font-mono text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3">farewell_message.md</span>
            <span className="ml-auto">{phase === 'open' ? 'decrypted' : 'encrypted · AES-256 (feelings)'}</span>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'locked' && (
              <motion.div
                key="locked"
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center justify-center py-14 text-center"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="glow-ring mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-ink-800"
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </motion.div>
                <p className="text-lg text-slate-300">
                  You have <span className="text-white">1 encrypted message</span> from {profile.name}.
                </p>
                <p className="mt-2 font-mono text-xs text-slate-500">Recipient: the best team I&apos;ve worked with</p>
                <button onClick={unlock} className="btn-neon mt-10">
                  <span>▶</span> Decrypt message
                </button>
              </motion.div>
            )}

            {phase === 'decrypting' && (
              <motion.div key="decrypting" exit={{ opacity: 0 }} className="py-10 font-mono text-xs text-slate-500">
                {noise.map((n, i) => (
                  <p key={i} className="truncate text-neon-cyan/60">
                    0x{n}
                  </p>
                ))}
                <p className="mt-6 text-slate-300">decrypting… {Math.floor(pct)}%</p>
                <div className="mt-3 h-1 w-full overflow-hidden rounded bg-white/10">
                  <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink" style={{ width: `${pct}%` }} />
                </div>
              </motion.div>
            )}

            {phase === 'open' && (
              <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-5 text-lg leading-relaxed text-slate-200 sm:text-xl" aria-live="polite">
                  {shown.map((para, i) => (
                    <p key={i} className={i === 0 ? 'text-white' : undefined}>
                      {para}
                      {i === shown.length - 1 && !done && <span className="ml-0.5 animate-blink text-neon-cyan">▋</span>}
                    </p>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={done ? { opacity: 1, y: 0 } : {}} className={`mt-10 ${done ? "" : "pointer-events-none"}`}>
                  <p className="text-slate-400">{farewellMessage.signoff}</p>
                  <p className="text-gradient mt-2 text-3xl font-semibold">{profile.name}</p>
                  <button
                    onClick={() => window.dispatchEvent(new Event(SIGNOFF_EVENT))}
                    className="btn-neon glow-ring mt-10"
                  >
                    Sign off <span aria-hidden>❯</span>
                  </button>
                </motion.div>
                {!done && (
                  <button
                    onClick={() => setTyped(full.length)}
                    className="absolute bottom-5 right-6 font-mono text-xs text-slate-500 hover:text-neon-cyan"
                  >
                    skip ⏭
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
