import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Message from '@/components/Message';
import Providers from '@/components/Providers';
import SignOff from '@/components/SignOff';

// Section order lives here. Content lives in src/data/content.ts.
export default function Home() {
  return (
    <Providers>
      <Nav />
      <main className="relative overflow-x-clip">
        {/* ambient colour washes behind everything */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[110vh] h-[60vh] w-[60vh] rounded-full bg-neon-violet/10 blur-[120px]" />
          <div className="absolute right-[-10%] top-[220vh] h-[50vh] w-[50vh] rounded-full bg-neon-cyan/10 blur-[120px]" />
          <div className="absolute left-[20%] top-[400vh] h-[60vh] w-[60vh] rounded-full bg-neon-pink/10 blur-[140px]" />
        </div>
        <Hero />
        <Timeline />
        <Projects />
        <Skills />
        <Message />
      </main>
      <SignOff />
    </Providers>
  );
}
