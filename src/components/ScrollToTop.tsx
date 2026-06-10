import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — resets scroll position to the top of the page on every
 * route change. Without this, navigating from a scrolled page (e.g. Index)
 * to another page (e.g. Chat) preserves the scroll position unexpectedly.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
