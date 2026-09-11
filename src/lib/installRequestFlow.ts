/** Kurulum talebi — auth sonrası detay form yolu */

export function installRequestPath(opts: {
  slug: string;
  name: string;
  hint?: string;
}): string {
  const q = new URLSearchParams();
  q.set('slug', opts.slug.slice(0, 255));
  q.set('name', opts.name.slice(0, 255));
  const hint = opts.hint?.trim();
  if (hint) q.set('hint', hint.slice(0, 500));
  return `/account/requests/new?${q.toString()}`;
}

/** Giriş yoksa kayıt; callback detay forma döner */
export function installRequestRegisterUrl(opts: {
  slug: string;
  name: string;
  hint?: string;
}): string {
  const callback = installRequestPath(opts);
  return `/register?next=install&callbackUrl=${encodeURIComponent(callback)}`;
}

export function installRequestLoginUrl(opts: {
  slug: string;
  name: string;
  hint?: string;
}): string {
  const callback = installRequestPath(opts);
  return `/login?callbackUrl=${encodeURIComponent(callback)}`;
}
