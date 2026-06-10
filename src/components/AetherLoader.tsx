/**
 * AetherLoader — minimal pure-CSS spinner used as the Suspense fallback.
 * Intentionally has NO Framer Motion dependency — importing Framer here
 * would create a circular dependency during lazy chunk loading.
 */
export function AetherLoader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#050508]"
      aria-label="Loading Aether..."
      role="status"
    >
      <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}
