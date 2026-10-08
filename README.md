# Farewell — a portfolio disguised as a goodbye

A personal farewell site styled like a product launch. It's built with Next.js 14, React 18, Tailwind, Framer Motion, React Three Fiber and GSAP.
Everything runs client-side. There's no backend, and it exports to plain static files.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production check:

```bash
npm run build        # static export → ./out
npm start            # serves ./out locally
```

## ✏️ Where to put your content

**All text lives in [`src/data/content.ts`](src/data/content.ts).** Search the file for `TODO`.

| What | Export in `content.ts` |
| --- | --- |
| Name, role, company, handle, last day | `profile` |
| Boot-sequence lines, headline, stats | `bootLines`, `heroHeadline`, `heroStats` |
| Timeline entries (join, promotions, milestones…) | `timeline` |
| Project cards (3–5) | `projects` (add screenshots/GIFs to `public/projects/` and set `image`) |
| Orbiting skill rings + "building next" list | `skillOrbits`, `buildingNext` |
| The farewell message | `farewellMessage` |
| Finale text | `signOff` |
| Contact cards (click-to-copy) + closing CTA | `contact` |


## Sections

1. **Hero** (`Hero.tsx`, `ParticleField.tsx`, `ScrambleText.tsx`): boot log, glitch-decode headline, and a 3D particle sphere that reacts to the mouse. A loading bar turns into a "scroll to begin" prompt.
2. **Journey** (`Timeline.tsx`): a GSAP ScrollTrigger timeline. The line draws itself as you scroll, and the cards slide in with staggered content.
3. **What I Built** (`Projects.tsx`): 3D flip cards. They flip on hover on desktop and on tap on mobile, and Enter/Space works too.
4. **Skills & Stack** (`Skills.tsx`): orbiting rings of technologies. Hovering pauses them, and the legend highlights a ring.
5. **Message** (`Message.tsx`): an "encrypted" message. Clicking decrypt plays a decode animation, then the message is typed out.
6. **Sign-off finale → Contact** (`SignOff.tsx`, `Contact.tsx`): once the message has finished typing and the reader has had a few seconds to finish it (or clicks "Sign off"), the page glitches and its text scrambles. Then "Thank you." and "signing off..." appear, the screen powers off like a CRT, and it powers back on as the contact page. The Email and LinkedIn cards copy on click and show a "copied" toast. The Nav "Contact" link also starts it. Text lives in `signOff` and `contact` in `content.ts`.

## Notes

- **Reduced motion:** all of these respect the OS "reduce motion" setting: Framer, GSAP, scramble, typewriter and orbit.
- **Performance:** Three.js loads client-side only, uses fewer particles on mobile, and stops rendering once the hero leaves the screen.
- **Hosting under a sub-path** (e.g. GitHub Pages at `/<repo>`): set `NEXT_PUBLIC_BASE_PATH=/<repo>` at build time. See `next.config.mjs`.
