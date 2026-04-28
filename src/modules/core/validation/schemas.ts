import { z } from 'zod'

export const AssetSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  type: z.enum(['exercise', 'workout', 'plan']),
  tags: z.array(z.string()),
  muscleGroups: z.array(z.string()),
  lastModified: z.string(),
  stressScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high']),
  fatigueImpact: z.number().min(0).max(100),
  usedInWorkouts: z.array(z.string()),
  usedInPlans: z.array(z.string()),
  usageCount: z.number().min(0),
  lastUsedAt: z.string().optional()
})

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: z.object({
    assetId: z.string() // Normalized single source of truth pointer
  })
})

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  animated: z.boolean().optional()
})

const GraphTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  version: z.number(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema)
})

export function validateGraphImport(jsonString: string) {
  try {
    const raw = JSON.parse(jsonString)
    const result = GraphTemplateSchema.safeParse(raw)
    
    if (!result.success) {
      console.error('Validation Boundary Failed:', result.error)
      return null
    }
    
    return result.data
  } catch (error) {
    console.error('Malformed JSON rejected at Validation Boundary.')
    return null
  }
}
