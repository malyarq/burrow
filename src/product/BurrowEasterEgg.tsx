import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, SVGProps } from 'react';
import { BurrowSymbol } from './BurrowSymbol';

const REQUIRED_CLICKS = 7;
const CLICK_WINDOW_MS = 2_000;
const REVEAL_MS = 1_200;
const PARTICLES = [
  { x: -26, y: -24, delay: 0 },
  { x: 2, y: -34, delay: 40 },
  { x: 27, y: -20, delay: 80 },
  { x: 35, y: 5, delay: 120 },
  { x: 18, y: 28, delay: 160 },
  { x: -14, y: 30, delay: 200 },
  { x: -34, y: 7, delay: 240 },
] as const;

export interface BurrowEasterEggProps extends SVGProps<SVGSVGElement> {
  disableAnimations: boolean;
}

/** Hidden seven-click tribute to the former ClassicHero mark; nothing moves before discovery. */
export function BurrowEasterEgg({ disableAnimations, ...symbolProps }: BurrowEasterEggProps) {
  const [active, setActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const clickTimes = useRef<number[]>([]);
  const clearReveal = useRef<number | null>(null);
  const reducedMotion = disableAnimations || prefersReducedMotion;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => () => {
    if (clearReveal.current !== null) window.clearTimeout(clearReveal.current);
  }, []);

  const reveal = () => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((time) => now - time < CLICK_WINDOW_MS);
    if (clickTimes.current.length < REQUIRED_CLICKS) return;

    clickTimes.current = [];
    if (clearReveal.current !== null) window.clearTimeout(clearReveal.current);
    setActive(true);
    clearReveal.current = window.setTimeout(() => {
      setActive(false);
      clearReveal.current = null;
    }, REVEAL_MS);
  };

  const onSymbolClick = (event: MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    reveal();
  };

  return (
    <span className="relative inline-flex" data-testid="burrow-easter-egg" data-active={active ? 'true' : 'false'}>
      <BurrowSymbol
        {...symbolProps}
        data-testid="burrow-easter-egg-trigger"
        onClick={onSymbolClick}
        className={`${symbolProps.className ?? ''} cursor-pointer`}
        style={{
          ...symbolProps.style,
          transform: active && !reducedMotion ? 'rotate(360deg) scale(1.1)' : symbolProps.style?.transform,
          transition: active && !reducedMotion ? 'transform 420ms ease-out' : 'none',
        }}
      />
      {active && (
        <span className="pointer-events-none absolute inset-0" aria-label="Easter egg activated" role="status">
          {PARTICLES.map((particle, index) => (
            <BurrowSymbol
              key={index}
              className="absolute h-3 w-3 text-current"
              style={{
                left: '50%',
                top: '50%',
                opacity: reducedMotion ? 0.75 : undefined,
                transform: reducedMotion
                  ? `translate(${particle.x}px, ${particle.y}px) scale(.72)`
                  : undefined,
                animation: reducedMotion
                  ? 'none'
                  : `burrow-easter-particle 700ms ease-out ${particle.delay}ms both`,
                '--burrow-particle-x': `${particle.x}px`,
                '--burrow-particle-y': `${particle.y}px`,
              } as CSSProperties}
            />
          ))}
        </span>
      )}
      <style>{`@keyframes burrow-easter-particle { from { opacity: 1; transform: translate(0, 0) scale(1); } to { opacity: 0; transform: translate(var(--burrow-particle-x), var(--burrow-particle-y)) scale(.45); } }`}</style>
    </span>
  );
}
