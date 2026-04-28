import { useEffect, useRef } from 'react'

export const useAutoScroll = (isDragging: boolean, containerRef?: React.RefObject<HTMLElement>) => {
  const speedRef = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!isDragging) {
      speedRef.current = 0
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 120
      const maxSpeed = 18
      const target = containerRef?.current || document.documentElement

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const distLeft = e.clientX - rect.left
        const distRight = rect.right - e.clientX

        if (distLeft < threshold) {
          speedRef.current = -maxSpeed * (1 - distLeft / threshold)
        } else if (distRight < threshold) {
          speedRef.current = maxSpeed * (1 - distRight / threshold)
        } else {
          speedRef.current = 0
        }
      } else {
        const distLeft = e.clientX
        const distRight = window.innerWidth - e.clientX

        if (distLeft < threshold) {
          speedRef.current = -maxSpeed * (1 - distLeft / threshold)
        } else if (distRight < threshold) {
          speedRef.current = maxSpeed * (1 - distRight / threshold)
        } else {
          speedRef.current = 0
        }
      }
    }

    const scrollLoop = () => {
      if (speedRef.current !== 0) {
        const target = containerRef?.current || window
        if (target === window) {
          window.scrollBy({ left: speedRef.current, top: 0 })
        } else {
          (target as HTMLElement).scrollLeft += speedRef.current
        }
      }
      frameRef.current = requestAnimationFrame(scrollLoop)
    }

    window.addEventListener('mousemove', handleMouseMove)
    frameRef.current = requestAnimationFrame(scrollLoop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameRef.current)
    }
  }, [isDragging, containerRef])
}
