'use client';

import { motion } from 'framer-motion';

type Props = { index: string; kicker: string; title: React.ReactNode; subtitle?: string };

export default function SectionHeading({ index, kicker, title, subtitle }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-16 max-w-3xl md:mb-20"
    >
      <p className="kicker mb-4">
        <span className="text-slate-500">{index} /</span> {kicker}
      </p>
      <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 max-w-xl text-lg text-slate-400">{subtitle}</p>}
    </motion.header>
  );
}
