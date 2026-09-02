import { HardHat } from 'lucide-react'

type SiteGroupAvatarProps = {
  className?: string
}

export function SiteGroupAvatar({ className = 'h-9 w-9' }: SiteGroupAvatarProps) {
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] ring-2 ring-white/20`}
      aria-hidden
    >
      <HardHat className="h-[50%] w-[50%]" strokeWidth={2.25} />
    </div>
  )
}
