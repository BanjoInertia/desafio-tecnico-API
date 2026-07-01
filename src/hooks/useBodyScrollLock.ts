import { useEffect } from 'react';

interface Options {
  hideScrollbar?: boolean;
}

export function useBodyScrollLock({ hideScrollbar = false }: Options = {}) {
  useEffect(() => {
    const html = document.documentElement;

    if (hideScrollbar) {
      const prevOverflow = html.style.overflow;
      const prevGutter = html.style.scrollbarGutter;
      const prevBody = document.body.style.overflow;
      html.style.overflow = 'hidden';
      html.style.scrollbarGutter = 'auto';
      document.body.style.overflow = 'hidden';
      return () => {
        html.style.overflow = prevOverflow;
        html.style.scrollbarGutter = prevGutter;
        document.body.style.overflow = prevBody;
      };
    }

    const prevent = (e: Event) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) e.preventDefault();
    };

    html.addEventListener('wheel', prevent, { passive: false });
    html.addEventListener('touchmove', prevent, { passive: false });
    document.addEventListener('keydown', preventKeys);

    return () => {
      html.removeEventListener('wheel', prevent);
      html.removeEventListener('touchmove', prevent);
      document.removeEventListener('keydown', preventKeys);
    };
  }, [hideScrollbar]);
}
