'use client';

import { useMemo } from 'react';

/** Harici bağımlılık olmadan eşleşme kodundan görsel QR ızgarası üretir. */
export default function PairingQr({
  code,
  size = 168,
}: {
  code: string;
  size?: number;
}) {
  const cells = useMemo(() => {
    const n = 21;
    const grid: boolean[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
    let seed = 0;
    for (let i = 0; i < code.length; i += 1) seed = (seed * 31 + code.charCodeAt(i)) >>> 0;

    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    for (let y = 0; y < n; y += 1) {
      for (let x = 0; x < n; x += 1) {
        grid[y][x] = rand() > 0.55;
      }
    }

    const paintFinder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y += 1) {
        for (let x = 0; x < 7; x += 1) {
          const edge = x === 0 || y === 0 || x === 6 || y === 6;
          const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[oy + y][ox + x] = edge || inner;
        }
      }
    };
    paintFinder(0, 0);
    paintFinder(n - 7, 0);
    paintFinder(0, n - 7);

    return grid;
  }, [code]);

  const cell = size / cells.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-xl bg-white p-2 shadow-sm"
      role="img"
      aria-label={`Eşleşme QR kodu ${code}`}
    >
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="#111"
            />
          ) : null
        )
      )}
    </svg>
  );
}
