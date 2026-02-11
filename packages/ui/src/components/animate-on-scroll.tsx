'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type AnimateOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  /** Engine animation class: "animate-slide-up" | "animate-fade-in" | "animate-scale-in" */
  animation?: string;
  /** IntersectionObserver threshold (0..1) */
  threshold?: number;
  /** Optional Tailwind delay class, e.g. "delay-150" */
  delay?: string;
  /** HTML element to render */
  as?: React.ElementType;
};

function AnimateOnScroll({
  children,
  className,
  animation = 'animate-slide-up',
  threshold = 0.15,
  delay,
  as: Comp = 'div',
}: AnimateOnScrollProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Comp
      ref={ref}
      className={cn(
        'will-change-[transform,opacity]',
        !shown && 'opacity-0 translate-y-2',
        shown && animation,
        delay,
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export { AnimateOnScroll };
export type { AnimateOnScrollProps };
