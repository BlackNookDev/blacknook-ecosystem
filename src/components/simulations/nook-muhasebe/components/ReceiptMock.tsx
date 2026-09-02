import { formatTRY } from '../lib/format'

export function ReceiptMock({
  scanning = false,
  vendor,
  vkn,
  slipNo,
  slipTime,
  date,
  lines,
  subtotal,
  tax,
  total,
}: {
  scanning?: boolean
  vendor: string
  vkn: string
  slipNo: string
  slipTime: string
  date: string
  lines: { label: string; amount: string }[]
  subtotal: number
  tax: number
  total: number
}) {
  const title = vendor.split(' ')[0]

  return (
    <div className="relative overflow-hidden rounded-md border border-stone-200 bg-[#f7f1e4] p-3 text-[#1c1917] shadow-sm">
      <div className="mb-2 border-b border-dashed border-stone-300 pb-2 text-center">
        <p className="text-[11px] font-extrabold tracking-wide">{title}</p>
        <p className="text-[9px] text-stone-600">{vendor}</p>
        <p className="mt-0.5 text-[8px] text-stone-500">VKN: {vkn}</p>
      </div>
      <div className="mb-2 flex justify-between text-[8px] text-stone-600">
        <span>
          {date} {slipTime}
        </span>
        <span>FİŞ NO: {slipNo}</span>
      </div>
      <div className="space-y-1 border-b border-dashed border-stone-300 pb-2 font-mono text-[9px]">
        {lines.map((line) => (
          <div key={line.label} className="flex justify-between gap-2">
            <span>{line.label}</span>
            <span>{line.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-0.5 font-mono text-[9px]">
        <div className="flex justify-between text-stone-600">
          <span>Matrah</span>
          <span>{formatTRY(subtotal).replace('₺', '')}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>KDV %20</span>
          <span>{formatTRY(tax).replace('₺', '')}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span>TOPLAM</span>
          <span>{formatTRY(total)}</span>
        </div>
      </div>
      {scanning && (
        <>
          <div className="absolute inset-0 bg-emerald-400/15" />
          <div className="scan-line absolute right-2 left-2 h-0.5 bg-emerald-500 shadow-[0_0_12px_#34d399]" />
        </>
      )}
    </div>
  )
}

