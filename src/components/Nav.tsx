'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/data/content';
import { CONTACT_EVENT } from './SignOff';

// "Contact" opens the finale's contact screen instead of scrolling
const openContact = (e: React.MouseEvent) => {
  e.preventDefault();
  window.dispatchEvent(new Event(CONTACT_EVENT));
};

const links = [
  { href: '#journey', label: 'Journey' },
  { href: '#built', label: 'Built' },
  { href: '#stack', label: 'Stack' },
  { href: '#message', label: 'Message' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        style={{ scaleX }}
        className="h-[2px] origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink"
      />
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 py-4 transition-all duration-500 sm:px-8 ${
          scrolled ? 'mt-3 rounded-full border border-white/10 bg-ink-950/60 backdrop-blur-xl md:max-w-5xl' : ''
        }`}
      >
        <a href="#hero" className="font-mono text-sm text-slate-300 hover:text-white">
          <span className="text-neon-cyan">~/</span>
          {profile.handle}
          <span className="animate-blink text-neon-cyan">_</span>
        </a>
        <ul className="hidden gap-7 font-mono text-xs uppercase tracking-widest text-slate-400 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={l.href === '#contact' ? openContact : undefined}
                className="transition-colors hover:text-neon-cyan"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" onClick={openContact} className="font-mono text-xs uppercase tracking-widest text-neon-cyan md:hidden">
          Contact →
        </a>
      </nav>
    </header>
  );
}
