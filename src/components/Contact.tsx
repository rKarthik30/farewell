'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { contact, profile } from '@/data/content';

// Cards come from `contact.links` in src/data/content.ts.
// Clicking a card copies its value and shows a toast (no navigation).

const Icon: Record<string, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for older browsers / non-secure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Final screen of the sign-off finale (rendered by SignOff.tsx). */
export default function Contact({ onBackToTop }: { onBackToTop?: () => void }) {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async (i: number) => {
    const link = contact.links[i];
    const ok = await copyText(link.copy);
    setToast({ id: Date.now(), text: ok ? `✓ ${link.toast}` : `Couldn't copy, it's ${link.copy}` });
    setCopiedIdx(i);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToast(null);
      setCopiedIdx(null);
    }, 2200);
  };

  const cols = contact.links.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-2xl';
  const ease = [0.2, 0.8, 0.2, 1] as const;

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.2),transparent_60%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="kicker mb-6"
        >
          <span className="text-slate-500">signed off · {profile.lastDay} /</span> Keep in touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="text-gradient mx-auto max-w-4xl pb-3 text-5xl font-semibold leading-[1] tracking-tight sm:text-7xl md:text-8xl"
        >
          {contact.headline}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-400"
        >
          {contact.sub}
        </motion.p>

        <div className={`mx-auto mt-14 grid w-full gap-4 ${cols}`}>
          {contact.links.map((l, i) => (
            <motion.button
              key={l.label}
              type="button"
              onClick={() => onCopy(i)}
              aria-label={`Copy ${l.label}: ${l.copy}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + 0.1 * i, duration: 0.5 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              className={`glass group flex flex-col items-center gap-3 p-6 transition-colors hover:border-neon-cyan/50 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)] ${
                copiedIdx === i ? '!border-neon-lime/60' : ''
              }`}
            >
              <span className={`transition-colors ${copiedIdx === i ? 'text-neon-lime' : 'text-slate-300 group-hover:text-neon-cyan'}`}>
                {Icon[l.icon]}
              </span>
              <span className="font-semibold text-white">{l.label}</span>
              <span className="max-w-full truncate font-mono text-xs text-slate-500">{l.display}</span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  copiedIdx === i ? 'text-neon-lime' : 'text-slate-600 group-hover:text-neon-cyan'
                }`}
              >
                {copiedIdx === i ? 'Copied ✓' : 'Click to copy'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-6 font-mono text-xs text-slate-500 sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.role}
        </p>
        {onBackToTop && (
          <button onClick={onBackToTop} className="text-neon-cyan hover:underline">
            ↑ back to the beginning
          </button>
        )}
      </footer>

      {/* copied toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-full border border-neon-lime/40 bg-ink-900/90 px-5 py-3 font-mono text-sm text-neon-lime shadow-[0_0_40px_-8px_rgba(163,230,53,0.6)] backdrop-blur-xl"
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
