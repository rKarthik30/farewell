'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import ScrambleText from './ScrambleText';
import Contact from './Contact';
import { profile, signOff } from '@/data/content';

/*
 * The finale. When the reader reaches the very bottom of the page (and stays
 * there ~1s) the page glitches, its text scrambles, then the screen shows
 * "Thank you." + "signing off...", powers down like an old CRT and
 * powers back on as the contact page (Contact.tsx).
 * Text comes from `signOff` in src/data/content.ts.
 */

type Phase = 'idle' | 'glitch' | 'message' | 'off' | 'ended';

const GLYPHS = '!<>-_/[]{}=+*^?#01ABCDEFXZ$%&アカサタナ';
const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#a3e635'];
const GLITCH_MS = 1300;
const rand = (n: number) => Math.floor(Math.random() * n);
const glyph = () => GLYPHS[rand(GLYPHS.length)];

/** Scrambles the real text on the page, then puts it back. */
function scramblePageText(root: Element | null, duration: number) {
  if (!root) return () => {};
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes: { node: Text; text: string }[] = [];
  while (walker.nextNode()) nodes.push({ node: walker.currentNode as Text, text: walker.currentNode.nodeValue! });

  const t0 = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    nodes.forEach(({ node, text }) => {
      node.nodeValue = [...text].map((c) => (c.trim() && Math.random() < p * 1.1 ? glyph() : c)).join('');
    });
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    nodes.forEach(({ node, text }) => (node.nodeValue = text));
  };
}

/** Full-screen glyph noise + tearing bars that ramps up to black. */
function GlitchCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const p = Math.min(1, (now - t0) / GLITCH_MS);
      const W = c.width;
      const H = c.height;
      ctx.fillStyle = `rgba(5,6,10,${0.04 + p * p * 0.5})`;
      ctx.fillRect(0, 0, W, H);
      ctx.font = '14px monospace';
      // scattered glyphs
      for (let i = 0; i < 30 + p * 500; i++) {
        ctx.globalAlpha = Math.random() * (0.3 + p * 0.7);
        ctx.fillStyle = COLORS[rand(4)];
        ctx.fillText(glyph(), rand(W), rand(H));
      }
      // full scrambled rows
      for (let r = 0; r < 1 + p * 8; r++) {
        ctx.globalAlpha = 0.25 + Math.random() * 0.5;
        ctx.fillStyle = COLORS[rand(4)];
        ctx.fillText(Array.from({ length: Math.ceil(W / 8) }, glyph).join(''), 0, rand(H));
      }
      // tearing bars
      for (let b = 0; b < 2 + p * 10; b++) {
        ctx.globalAlpha = 0.08 + Math.random() * 0.15;
        ctx.fillStyle = COLORS[rand(4)];
        ctx.fillRect(0, rand(H), W, 2 + rand(28));
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function Typed({ text, start, onDone }: { text: string; start: boolean; onDone: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (n >= text.length) {
      onDone();
      return;
    }
    const id = setTimeout(() => setN((v) => v + 1), n === 0 ? 250 : 70);
    return () => clearTimeout(id);
  }, [start, n, text, onDone]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="animate-blink text-neon-cyan">▋</span>
    </span>
  );
}

/** Fire from anywhere to start the finale (Message.tsx does this once the note is read). */
export const SIGNOFF_EVENT = 'farewell:signoff';
/** Fire from anywhere to jump straight to the contact screen (Nav "Contact" link). */
export const CONTACT_EVENT = 'farewell:contact';

export default function SignOff() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [headlineDone, setHeadlineDone] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const start = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    setHeadlineDone(false);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPhase(reduced ? 'message' : 'glitch');
  }, []);

  useEffect(() => {
    const openContact = () => setPhase('ended');
    window.addEventListener(SIGNOFF_EVENT, start);
    window.addEventListener(CONTACT_EVENT, openContact);
    return () => {
      window.removeEventListener(SIGNOFF_EVENT, start);
      window.removeEventListener(CONTACT_EVENT, openContact);
    };
  }, [start]);

  const close = useCallback(() => setPhase('idle'), []);
  const backToTop = useCallback(() => {
    setPhase('idle');
    // wait for the scroll lock to lift before jumping to the top
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }, []);

  // glitch phase: shake page + scramble its text, then hand over to the message
  useEffect(() => {
    if (phase !== 'glitch') return;
    const html = document.documentElement;
    html.classList.add('glitching');
    const restore = scramblePageText(document.querySelector('#message'), GLITCH_MS * 0.8);
    const id = setTimeout(() => setPhase('message'), GLITCH_MS);
    return () => {
      clearTimeout(id);
      html.classList.remove('glitching');
      restore();
    };
  }, [phase]);

  // lock scroll + Esc to close while the overlay is up
  useEffect(() => {
    if (phase === 'idle') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, close]);

  const onTypedDone = useCallback(() => {
    setTimeout(() => {
      if (phaseRef.current !== 'message') return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPhase(reduced ? 'ended' : 'off');
    }, 1200);
  }, []);

  return (
    <>
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="signoff"
            initial={{ opacity: phase === 'glitch' ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[120] overflow-hidden"
            role="dialog"
            aria-label="Signing off"
          >
            {phase === 'glitch' && <GlitchCanvas />}
            {/* solid backdrop so the page never peeks through the CRT transitions */}
            {phase !== 'glitch' && <div className="absolute inset-0 bg-black" />}

            {(phase === 'message' || phase === 'off') && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950 px-6 text-center"
                initial={{ opacity: 0 }}
                animate={
                  phase === 'off'
                    ? { scaleY: [1, 0.004, 0.004], scaleX: [1, 1, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(5)'] }
                    : { opacity: 1 }
                }
                transition={phase === 'off' ? { duration: 0.6, times: [0, 0.55, 1], ease: 'easeIn' } : { duration: 0.25 }}
                onAnimationComplete={() => phase === 'off' && setPhase('ended')}
              >
                {/* scanlines + vignette */}
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

                <h2 className="text-gradient relative pb-2 text-6xl font-semibold tracking-tight sm:text-8xl md:text-9xl">
                  <ScrambleText text={signOff.headline} spread={3} onDone={() => setHeadlineDone(true)} />
                </h2>
                <p className="relative mt-6 min-h-[2rem] font-mono text-lg text-slate-300 sm:text-2xl">
                  <span className="text-neon-lime">❯ </span>
                  <Typed text={signOff.typed} start={headlineDone} onDone={onTypedDone} />
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: headlineDone ? 1 : 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="relative mt-10 font-mono text-xs uppercase tracking-[0.3em] text-slate-500"
                >
                  {profile.name} · {profile.lastDay}
                </motion.p>
              </motion.div>
            )}

            {phase === 'ended' && (
              // the screen "powers back on" as the contact page
              <motion.div
                initial={{ scaleX: 0, scaleY: 0.004, filter: 'brightness(5)' }}
                animate={{ scaleX: [0, 1, 1], scaleY: [0.004, 0.004, 1], filter: ['brightness(5)', 'brightness(3)', 'brightness(1)'] }}
                transition={{ duration: 0.6, times: [0, 0.4, 1], ease: 'easeOut', delay: 0.1 }}
                className="absolute inset-0 bg-ink-950"
              >
                <div className="h-full overflow-y-auto">
                  <Contact onBackToTop={backToTop} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
