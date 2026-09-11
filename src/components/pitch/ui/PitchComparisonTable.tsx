import { cn } from '@/lib/utils';

type Row = {
  feature: string;
  values: readonly string[];
};

type Props = {
  headers: readonly string[];
  rows: readonly Row[];
  className?: string;
};

function IconCell({ v }: { v: string }) {
  const color =
    v === '✓'
      ? 'text-emerald-400'
      : v === '✗'
        ? 'text-red-400/80'
        : v === '★'
          ? 'text-teal-300'
          : 'text-amber-300/90';
  return <span className={cn('font-display text-base', color)}>{v}</span>;
}

export function PitchComparisonTable({ headers, rows, className }: Props) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left">
            {headers.map((h, idx) => (
              <th
                key={h}
                className={cn(
                  'border-b border-white/10 px-3 py-3 font-medium text-zinc-500 sm:px-4',
                  idx === headers.length - 1 && 'font-display text-teal-300/90'
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.feature} className="hover:bg-white/[0.02]">
              <td className="border-b border-white/[0.06] px-3 py-3 text-zinc-200 sm:px-4">
                {r.feature}
              </td>
              {r.values.map((v, i) => (
                <td
                  key={`${r.feature}-${i}`}
                  className={cn(
                    'border-b border-white/[0.06] px-3 py-3 sm:px-4',
                    i === r.values.length - 1 && 'bg-teal-500/[0.04]'
                  )}
                >
                  <IconCell v={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
