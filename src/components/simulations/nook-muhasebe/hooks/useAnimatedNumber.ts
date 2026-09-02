import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(target: number, duration = 900): number {
  const [current, setCurrent] = useState(target)
  const previous = useRef(target)

  useEffect(() => {
    const from = previous.current
    if (from === target) {
      setCurrent(target)
      return
    }

    const started = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - progress) ** 3
      setCurrent(from + (target - from) * eased)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      previous.current = target
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return current
}
