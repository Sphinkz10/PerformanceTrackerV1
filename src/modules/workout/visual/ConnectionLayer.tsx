import { useEffect, useState } from 'react'
import { WorkoutConnection } from '../../../domain/workout/connections'
import { VisualNode } from '../../../domain/workout/visual'

interface Props {
  nodes: VisualNode[]
  connections: WorkoutConnection[]
  activeDragCoords?: { id: string, x: number, y: number } | null
}

export function ConnectionLayer({ nodes, connections, activeDragCoords }: Props) {
  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({})

  const updatePositions = () => {
    const newPos: Record<string, {x: number, y: number}> = {}
    nodes.forEach(node => {
      const el = document.getElementById(node.id)
      if (el) {
        const rect = el.getBoundingClientRect()
        newPos[node.id] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      }
    })
    setPositions(newPos)
  }

  useEffect(() => {
    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [nodes])

  const drawBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const offset = Math.abs(y2 - y1) / 2
    return `M ${x1} ${y1} C ${x1} ${y1 + offset}, ${x2} ${y2 - offset}, ${x2} ${y2}`
  }

  return (
    <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      {connections.map(conn => {
        let from = positions[conn.from]
        let to = positions[conn.to]
        
        if (activeDragCoords?.id === conn.from) from = { x: activeDragCoords.x, y: activeDragCoords.y }
        if (activeDragCoords?.id === conn.to) to = { x: activeDragCoords.x, y: activeDragCoords.y }

        if (!from || !to) return null

        const isSuperset = conn.type === 'superset'
        return (
          <path
            key={conn.id}
            d={drawBezier(from.x, from.y, to.x, to.y)}
            fill="none"
            stroke={isSuperset ? 'rgba(212, 175, 55, 0.6)' : 'rgba(20, 184, 166, 0.6)'}
            strokeWidth="3"
            strokeDasharray={isSuperset ? '6 6' : 'none'}
            className="transition-colors duration-200"
          />
        )
      })}
    </svg>
  )
}
