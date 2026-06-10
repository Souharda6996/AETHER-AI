import { useReducedMotion } from "framer-motion";

/**
 * useAnimationConfig — respects the OS-level "prefers-reduced-motion"
 * accessibility setting. When the user has reduced motion enabled,
 * all durations collapse to 0 and initial offsets are removed so
 * elements appear instantly rather than animating.
 *
 * Usage:
 *   const { transition, initial, animate } = useAnimationConfig();
 *   <motion.div initial={initial} animate={animate} transition={transition} />
 */
export function useAnimationConfig() {
  const shouldReduce = useReducedMotion();

  return {
    transition: shouldReduce
      ? { duration: 0 }
      : { duration: 0.3, ease: "easeOut" },
    initial: shouldReduce ? {} : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  } as const;
}
