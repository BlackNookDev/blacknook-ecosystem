/** Full-bleed atmospheric plane — soft charcoal with cool silver light. */
export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[var(--bn-bg)] transition-colors duration-300" aria-hidden>
      <div className="bn-atmosphere absolute inset-0 transition-[background] duration-300" />
      <div className="bn-grain absolute inset-0 opacity-[0.022]" />
      <div className="bn-site-glow-top absolute inset-x-0 top-0 h-[75vh]" />
      <div className="bn-site-glow-bottom absolute inset-x-0 bottom-0 h-[40vh]" />
    </div>
  );
}
