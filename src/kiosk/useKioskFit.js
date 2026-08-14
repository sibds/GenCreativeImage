import { useLayoutEffect, useRef, useState } from 'react';
import { computeKioskZoom } from './config.js';

export function useKioskFit(enabled, revision = 0) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    if (!enabled) {
      setZoom(1);
      const el = ref.current;
      if (el) el.style.zoom = '';
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      el.style.zoom = '1';
      const prevOverflow = el.style.overflow;
      el.style.overflow = 'auto';
      const z = computeKioskZoom({
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight
      });
      el.style.overflow = prevOverflow || 'hidden';
      el.style.zoom = String(z);
      setZoom(z);
    };

    measure();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    window.addEventListener('resize', measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      el.style.zoom = '';
    };
  }, [enabled, revision]);

  return { ref, zoom };
}
