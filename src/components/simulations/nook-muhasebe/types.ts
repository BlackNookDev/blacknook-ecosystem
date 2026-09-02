export interface ReceiptItem {
  id: string
  date: string
  project: string
  vendor: string
  vkn: string
  category: string
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'approved'
}

export type DemoStep =
  | 'idle'
  | 'chiefTyping'
  | 'message'
  | 'receipt'
  | 'analyzing'
  | 'analyzed'
  | 'syncing'
  | 'synced'

export interface DemoScene {
  receipt: ReceiptItem
  message: string
  time: string
  slipNo: string
  slipTime: string
  lines: { label: string; amount: string }[]
}
