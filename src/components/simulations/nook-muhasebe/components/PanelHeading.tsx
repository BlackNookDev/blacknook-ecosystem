import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

type PanelHeadingProps = {
  label: string
  done: boolean
  className?: string
}

export function PanelHeading({ label, done, className = '' }: PanelHeadingProps) {
  return (
    <div className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-wa-accent uppercase">
        {label}
      </p>
      <AnimatePresence>
        {done && (
          <motion.span
            initial={{ scale: 0.45, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-wa-accent text-white shadow-[0_0_10px_rgba(37,211,102,0.45)]"
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
