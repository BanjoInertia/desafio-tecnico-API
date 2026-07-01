import { useEffect } from 'react';

interface Options {
  hideScrollbar?: boolean;
}

export function useBodyScrollLock({ hideScrollbar = false }: Options = {}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (hideScrollbar) {
      const prevHtmlOverflow = html.style.overflow;
      const prevGutter = html.style.scrollbarGutter;
      const prevBodyOverflow = body.style.overflow;
      html.style.overflow = 'hidden';
      html.style.scrollbarGutter = 'auto';
      body.style.overflow = 'hidden';
      return () => {
        html.style.overflow = prevHtmlOverflow;
        html.style.scrollbarGutter = prevGutter;
        body.style.overflow = prevBodyOverflow;
      };
    }

    const prevBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevBodyOverflow;
    };
  }, [hideScrollbar]);
}
