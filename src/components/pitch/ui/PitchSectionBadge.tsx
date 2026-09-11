export function PitchSectionBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300 backdrop-blur">
      {text}
    </span>
  );
}
