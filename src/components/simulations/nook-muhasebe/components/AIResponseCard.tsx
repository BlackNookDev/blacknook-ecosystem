import { MapPin, CircleCheck } from 'lucide-react'
import { formatTRY } from '../lib/format'
import type { ReceiptItem } from '../types'

export function AIResponseCard({ receipt }: { receipt: ReceiptItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-3 py-2">
        <CircleCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
        <p className="text-[11px] font-semibold leading-snug text-emerald-800">
          Muhasebeye aktarıldı
        </p>
      </div>

      <div className="space-y-2.5 px-3 py-3 text-[11px]">
        <div>
          <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Tedarikçi</p>
          <p className="font-semibold text-slate-900">{receipt.vendor}</p>
          <p className="text-slate-500">VKN: {receipt.vkn}</p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-slate-50 p-2">
          <Metric label="Toplam" value={formatTRY(receipt.total)} accent />
          <Metric label="KDV %20" value={formatTRY(receipt.tax)} />
          <Metric label="Matrah" value={formatTRY(receipt.subtotal)} />
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 text-emerald-600" strokeWidth={2.2} />
          <div>
            <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
              Proje
            </p>
            <p className="font-medium text-slate-800">{receipt.project}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="text-[8px] tracking-wider text-slate-400 uppercase">{label}</p>
      <p className={`font-semibold ${accent ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}
