'use client';

import { useMemo, useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudioFile, StudioGeneration } from '@/lib/studioGenerate';

type Props = {
  generation: StudioGeneration;
  className?: string;
};

export default function StudioGenerationPanel({
  generation,
  className,
}: Props) {
  const files = generation.files;
  const [activePath, setActivePath] = useState(files[0]?.path || '');
  const active: StudioFile | undefined = useMemo(
    () => files.find((f) => f.path === activePath) || files[0],
    [activePath, files]
  );

  return (
    <aside
      className={cn(
        'flex min-h-0 w-full flex-col border-b border-[var(--bn-border)] bg-zinc-950 md:w-[22rem] md:border-b-0 md:border-r',
        className
      )}
    >
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <FileCode2 className="h-4 w-4 text-teal-400" aria-hidden />
          {generation.title}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{generation.summary}</p>
        {generation.model ? (
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
            model · {generation.model}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:min-h-0">
        <ul className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.06] px-2 py-2 md:block md:space-y-0.5 md:overflow-y-auto md:border-b-0 md:px-2 md:py-2">
          {files.map((file) => (
            <li key={file.path} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => setActivePath(file.path)}
                className={cn(
                  'w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition',
                  (active?.path || '') === file.path
                    ? 'bg-white/10 font-semibold text-white'
                    : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                )}
              >
                {file.path}
              </button>
            </li>
          ))}
        </ul>
        <pre className="min-h-[10rem] flex-1 overflow-auto px-3 py-3 text-[11px] leading-relaxed text-zinc-300 md:min-h-0">
          {active?.content || ''}
        </pre>
      </div>
    </aside>
  );
}

