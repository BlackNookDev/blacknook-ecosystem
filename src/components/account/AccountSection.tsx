import type { ReactNode } from 'react';

type Props = {
  id?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
};

export default function AccountSection({ id, title, description, children, action }: Props) {
  return (
    <section id={id} className="border-t border-white/[0.08] py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
