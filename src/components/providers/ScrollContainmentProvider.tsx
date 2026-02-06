"use client";

import { useEffect } from "react";

/**
 * Finds the scrollable element that should consume the wheel event.
 * - If target is a textarea or scrollable input, use it.
 * - Otherwise walk up to find the nearest element with overflow scroll/auto that can scroll.
 */
function getScrollableElement(target: EventTarget | null): HTMLElement | null {
  let el = target instanceof HTMLElement ? target : null;
  while (el) {
    if (el.tagName === "TEXTAREA") return el;
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight + 1;
    if (canScroll) return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * Global provider that keeps wheel scrolling contained to the element under the cursor.
 * When you scroll over a textarea or overflow-auto/scroll div, only that element scrolls;
 * the page body scrolls only when that element hits its scroll boundary.
 * No need to use useContainedWheelScroll() in individual components.
 */
export function ScrollContainmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const el = getScrollableElement(e.target as Node);
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;
      const canScrollUp = scrollTop > 1;
      const deltaY = e.deltaY;

      if (deltaY > 0 && canScrollDown) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollTop += deltaY;
      } else if (deltaY < 0 && canScrollUp) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollTop += deltaY;
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () =>
      document.removeEventListener("wheel", handleWheel, { capture: true });
  }, []);

  return <>{children}</>;
}
