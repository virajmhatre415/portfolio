'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

const scenes = [
  {
    start: 0,
    end: 0.29,
    position: 'items-start text-left',
    eyebrow: 'HELLO, I’M VIRAJ MHATRE',
    title: 'Engineering data.\nCreating impact.',
    subtitle: 'PL/SQL · ORACLE ODI · ETL',
  },
  {
    start: 0.30,
    end: 0.60,
    position: 'items-start text-left',
    eyebrow: '01 / WHAT I DO',
    title: 'I build reliable\ndata pipelines.',
    subtitle: 'From source to insight. Clean, scalable, precise.',
  },
  {
    start: 0.61,
    end: 0.97,
    position: 'items-end text-right',
    eyebrow: '02 / MY APPROACH',
    title: 'Bridging data\nand business.',
    subtitle: 'Performance, quality, and production reliability.',
  },
];

type SceneProps = (typeof scenes)[number] & { progress: MotionValue<number> };

function Scene({ progress, start, end, position, eyebrow, title, subtitle }: SceneProps) {
  const opacity = useTransform(
    progress,
    start === 0 ? [0, 0.02, end - 0.065, end] : [start - 0.025, start + 0.045, end - 0.06, end],
    start === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -50]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute inset-0 flex flex-col justify-center px-7 md:px-[10vw] ${position}`}
    >
      <span className="mb-5 text-[10px] font-medium uppercase tracking-[.34em] text-orange-300 md:text-xs">
        {eyebrow}
      </span>
      <h1 className="max-w-4xl whitespace-pre-line text-[clamp(2.7rem,7.9vw,8.5rem)] font-semibold leading-[.99] tracking-[-.07em] text-white">
        {title}
      </h1>
      <p className="mt-7 max-w-md text-[10px] uppercase leading-6 tracking-[.18em] text-slate-200 md:text-sm">
        {subtitle}
      </p>
    </motion.div>
  );
}

export default function Overlay({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-10">
      {scenes.map((scene) => <Scene key={scene.eyebrow} progress={progress} {...scene} />)}
      <div className="absolute bottom-8 left-7 text-[10px] uppercase tracking-[.28em] text-white/65 md:left-[10vw]">
        Scroll to explore ↓
      </div>
      <div className="absolute bottom-8 right-7 text-[10px] tracking-[.22em] text-white/65 md:right-[10vw]">
        01 — 03
      </div>
    </div>
  );
}
