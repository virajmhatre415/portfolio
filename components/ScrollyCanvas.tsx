'use client';

import { useEffect, useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Overlay from './Overlay';

const FRAME_COUNT = 90;
const FRAME_PATH = (index: number) =>
  `/frames/frame_${String(index).padStart(2, '0')}_delay-0.067s.webp`;
const BACKGROUND = '#080d15';

/**
 * A 500vh scroll experience. If a real frame sequence is present, it scrubs it.
 * Otherwise, it uses a subtle camera move on the supplied portrait, never
 * pretending that a single photograph contains real alternate camera angles.
 */
export default function ScrollyCanvas() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const portraitRef = useRef<HTMLImageElement | null>(null);
  const hasSequenceRef = useRef(false);
  const progressRef = useRef(0);
  const redrawRef = useRef<() => void>(() => {});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progressRef.current = Math.max(0, Math.min(1, value));
    redrawRef.current();
  });

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    function closestFrame(index: number): HTMLImageElement | null {
      const direct = imagesRef.current[index];
      if (direct) return direct;
      for (let delta = 1; delta < FRAME_COUNT; delta += 1) {
        const previous = imagesRef.current[index - delta];
        const next = imagesRef.current[index + delta];
        if (previous) return previous;
        if (next) return next;
      }
      return null;
    }

    function draw() {
      if (!canvas || !ctx || cancelled) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (rect.width !== width || rect.height !== height || nextDpr !== dpr) {
        width = rect.width;
        height = rect.height;
        dpr = nextDpr;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, width, height);

      const index = Math.round(progressRef.current * (FRAME_COUNT - 1));
      const image = (hasSequenceRef.current && closestFrame(index)) || portraitRef.current;
      if (!image?.naturalWidth || !image.naturalHeight) return;

      const isStaticPortrait = image === portraitRef.current;
      const scroll = progressRef.current;
      const cameraZoom = isStaticPortrait ? 1.04 + scroll * 0.13 : 1;
      const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const scale = cover * cameraZoom;
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      const offsetX = isStaticPortrait ? (scroll - 0.5) * Math.min(65, width * 0.055) : 0;
      const offsetY = isStaticPortrait ? (scroll - 0.5) * Math.min(50, height * 0.05) : 0;
      ctx.drawImage(
        image,
        (width - drawnWidth) / 2 + offsetX,
        (height - drawnHeight) / 2 + offsetY,
        drawnWidth,
        drawnHeight,
      );
    }

    function requestDraw() {
      if (cancelled || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    }

    redrawRef.current = requestDraw;
    const observer = new ResizeObserver(requestDraw);
    observer.observe(canvas);
    requestDraw();

    // Always show the portrait immediately while checking for an image sequence.
    const portrait = new Image();
    portrait.decoding = 'async';
    portrait.onload = () => {
      if (!cancelled) {
        portraitRef.current = portrait;
        requestDraw();
      }
    };
    portrait.src = '/images/portrait.jpg';

    // Probe frame 0. When no sequence is uploaded, avoid 89 unnecessary 404s.
    const firstFrame = new Image();
    firstFrame.decoding = 'async';
    firstFrame.onload = () => {
      if (cancelled) return;
      hasSequenceRef.current = true;
      imagesRef.current[0] = firstFrame;
      requestDraw();

      // Progressive preload: small batches avoid saturating connections.
      const queue = Array.from({ length: FRAME_COUNT - 1 }, (_, i) => i + 1);
      const prioritised = [30, 60, 89].filter((i) => queue.includes(i));
      const indices = [...prioritised, ...queue.filter((i) => !prioritised.includes(i))];
      let cursor = 0;
      function next() {
        if (cancelled || cursor >= indices.length) return;
        const index = indices[cursor++];
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          if (!cancelled) {
            imagesRef.current[index] = image;
            requestDraw();
            next();
          }
        };
        image.onerror = next;
        image.src = FRAME_PATH(index);
      }
      for (let i = 0; i < 6; i += 1) next();
    };
    firstFrame.src = FRAME_PATH(0);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      redrawRef.current = () => {};
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080d15]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Cinematic scroll-controlled portrait of Viraj Mhatre"
          className="block h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080d15]/80 via-[#080d15]/20 to-[#080d15]/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080d15]/90 via-transparent to-[#080d15]/50" />
        <Overlay progress={scrollYProgress} />
      </div>
    </section>
  );
}
