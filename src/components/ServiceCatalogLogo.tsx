'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  isCatalogMarkImage,
  logoPlateTone,
  resolveServiceLogo,
  type LogoThemeMode,
} from '@/lib/serviceIconMap';
import { cn } from '@/lib/utils';

type ServiceCatalogLogoProps = {
  icon: string;
  brandColor: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  framed?: boolean;
  frameClassName?: string;
};

const SIZE = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const;

const FRAME = {
  sm: 'h-8 w-8 rounded-lg p-1',
  md: 'h-12 w-12 rounded-xl p-1.5',
  lg: 'h-[4.75rem] w-[4.75rem] rounded-2xl p-2.5 sm:h-20 sm:w-20',
} as const;

const MONO_SIZE = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
} as const;

function monogram(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function sampleMarkTone(img: HTMLImageElement): 'light' | 'dark' | null {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let lumSum = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 40) continue;
      lumSum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      n += 1;
    }
    if (n < 8) return null;
    const opaqueRatio = n / (size * size);
    if (opaqueRatio > 0.85) return 'dark';
    const avg = lumSum / n;
    if (avg < 0.28) return 'light';
    return 'dark';
  } catch {
    return null;
  }
}

function LogoMark({
  icon,
  brandColor,
  name,
  size,
  className,
  theme,
}: Omit<ServiceCatalogLogoProps, 'framed' | 'frameClassName'> & { theme: LogoThemeMode }) {
  const [imgFailed, setImgFailed] = useState(false);
  const dim = SIZE[size ?? 'sm'];
  const resolved = resolveServiceLogo(icon, brandColor, theme);

  if (resolved.kind === 'icon') {
    const { Icon, color } = resolved;
    return <Icon className={cn(dim, className)} color={color} aria-hidden />;
  }

  if (imgFailed) {
    return (
      <span
        className={cn(
          dim,
          MONO_SIZE[size ?? 'sm'],
          'inline-flex items-center justify-center font-bold text-[var(--bn-icon)]',
          className
        )}
        aria-hidden
      >
        {monogram(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved.src}
      alt={`${name} logosu`}
      className={cn(
        dim,
        'object-contain',
        isCatalogMarkImage(resolved.src) && 'bn-logo-mark',
        className
      )}
      loading="lazy"
      decoding="async"
      onError={() => setImgFailed(true)}
    />
  );
}

export default function ServiceCatalogLogo({
  icon,
  brandColor,
  name,
  size = 'sm',
  className = '',
  framed = false,
  frameClassName,
}: ServiceCatalogLogoProps) {
  const { theme } = useTheme();
  const heuristic = logoPlateTone(icon, brandColor, theme);
  const [plate, setPlate] = useState<'light' | 'dark'>(heuristic);
  const resolved = resolveServiceLogo(icon, brandColor, theme);
  const imageSrc = resolved.kind === 'image' ? resolved.src : '';

  useEffect(() => {
    setPlate(heuristic);
    if (!framed || !imageSrc.startsWith('/')) return;

    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      const sampled = sampleMarkTone(img);
      if (!cancelled && sampled) setPlate(sampled);
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [framed, heuristic, imageSrc, theme]);

  const mark = (
    <LogoMark
      icon={icon}
      brandColor={brandColor}
      name={name}
      size={size}
      theme={theme}
      className={framed ? undefined : className}
    />
  );

  if (!framed) return mark;

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden ring-1',
        FRAME[size],
        plate === 'light'
          ? 'bg-[var(--bn-surface)] ring-[var(--bn-card-border)]'
          : 'bg-zinc-950 ring-white/15',
        frameClassName,
        className
      )}
    >
      {mark}
    </div>
  );
}
