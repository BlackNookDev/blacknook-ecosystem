import { KPIBar } from './KPIBar'
import { PanelHeading } from './PanelHeading'
import { ReceiptTable } from './ReceiptTable'
import type { ReceiptItem } from '../types'

type ERPPanelProps = {
  spend: number
  receipts: ReceiptItem[]
  highlightId: string | null
  onApprove: (id: string) => void
  done: boolean
}

export function ERPPanel({
  spend,
  receipts,
  highlightId,
  onApprove,
  done,
}: ERPPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden px-2.5 py-3">
      <PanelHeading label="Merkez Muhasebe ERP" done={done} />
      <KPIBar spend={spend} />
      <ReceiptTable receipts={receipts} highlightId={highlightId} onApprove={onApprove} />
    </div>
  )
}
