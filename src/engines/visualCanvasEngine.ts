import type { VisualNode } from '../domain/workout/visual'
import { arrayMove } from '@dnd-kit/sortable'

export function reorderNodes(
  nodes: VisualNode[],
  activeId: string,
  overId: string
): VisualNode[] {
  const activeIndex = nodes.findIndex(n => n.id === activeId)
  const overIndex = nodes.findIndex(n => n.id === overId)

  if (activeIndex === -1 || overIndex === -1) return nodes

  const activeNode = nodes[activeIndex]
  const overNode = nodes[overIndex]

  // Se forem do mesmo tipo de "contentor" (ex: trocar dois exercícios)
  if (activeNode.parentId === overNode.parentId) {
     const newNodes = arrayMove(nodes, activeIndex, overIndex)
     // Atualiza a ordem interna
     return newNodes.map((n, i) => n.parentId === activeNode.parentId ? { ...n, order: i } : n)
  }

  // Se estamos a arrastar um exercício para um novo Superset/Fase
  const newNodes = [...nodes]
  newNodes[activeIndex] = {
    ...activeNode,
    parentId: overNode.parentId || overNode.id // Fica filho do contentor alvo
  }
  
  return newNodes.map((n, i) => ({ ...n, order: i })) // Re-indexar tudo
}
