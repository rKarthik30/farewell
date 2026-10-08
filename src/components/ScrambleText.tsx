'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_/[]{}=+*^?#01ABCDEFXZ$%&';

type Char = { c: string; mode: 'hidden' | 'scramble' | 'done' };

type Props = {
  text: string;
  start?: boolean;
  /** frames between each character starting — lower = faster */
  spread?: number;
  className?: string;
  onDone?: () => void;
};

/**
 * Glitch / decode reveal: each character cycles through random glyphs
 * before settling on its real value. Words never break mid-word.
 */
export default function ScrambleText({ text, start = true, spread = 1.1, className, onDone }: Props) {
  const [chars, setChars] = useState<Char[]>(() => [...text].map((c) => ({ c, mode: 'hidden' })));
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars([...text].map((c) => ({ c, mode: 'done' })));
      doneRef.current?.();
      return;
    }
    const queue = [...text].map((to, i) => {
      const s = Math.floor(i * spread + Math.random() * 8);
      return { to, start: s, end: s + 8 + Math.floor(Math.random() * 18), glyph: '' };
    });
    let frame = 0;
    let raf = 0;
    const tick = () => {
      let done = 0;
      const next = queue.map<Char>((q) => {
        if (q.to === ' ' || frame >= q.end) {
          done++;
          return { c: q.to, mode: 'done' };
        }
        if (frame >= q.start) {
          if (!q.glyph || Math.random() < 0.3) q.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          return { c: q.glyph, mode: 'scramble' };
        }
        return { c: q.to, mode: 'hidden' };
      });
      setChars(next);
      if (done === queue.length) {
        doneRef.current?.();
        return;
      }
      frame++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text, spread]);

  // group characters into words so line-wrapping stays natural
  const words: Char[][] = [[]];
  [...text].forEach((src, i) => {
    if (src === ' ') words.push([]);
    else words[words.length - 1].push(chars[i]);
  });

  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {w.map((ch, ci) => (
            <span
              key={ci}
              className={
                ch.mode === 'hidden' ? 'invisible' : ch.mode === 'scramble' ? 'text-neon-cyan opacity-80' : undefined
              }
            >
              {ch.c}
            </span>
          ))}
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}
