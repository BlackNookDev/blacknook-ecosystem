/** Pitch ambient — SiteBackground ile aynı kesintisiz charcoal derinlik */
export function PitchTechBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bn-bg)]"
    >
      <div className="bn-atmosphere absolute inset-0" />
      <div className="bn-grain absolute inset-0 opacity-[0.022]" />
    </div>
  );
}
