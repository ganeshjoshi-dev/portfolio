'use client';

import { useRef, useEffect } from 'react';

/**
 * Returns a ref to attach to a scrollable element (textarea, div with overflow).
 * When the user scrolls with the wheel over that element, only the element scrolls
 * and the page body does not. When the element hits its scroll boundary, the
 * event propagates so the page can scroll.
 *
 * Uses a native listener with { passive: false } so preventDefault() is respected
 * (React's onWheel is passive by default and cannot prevent default scroll).
 *
 * Use on scrollable content areas (e.g. code/text inputs) to prevent the whole
 * page from scrolling when the user intends to scroll only the content.
 */
export function useContainedWheelScroll<T extends HTMLDivElement | HTMLTextAreaElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e: Event) => {
      const we = e as WheelEvent;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;
      const canScrollUp = scrollTop > 1;
      const deltaY = we.deltaY;

      if (deltaY > 0 && canScrollDown) {
        we.preventDefault();
        we.stopPropagation();
        el.scrollTop += deltaY;
      } else if (deltaY < 0 && canScrollUp) {
        we.preventDefault();
        we.stopPropagation();
        el.scrollTop += deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return ref;
}
