import { LibraryAsset } from '../types'

export function computeAssetScore(asset: LibraryAsset): number {
  return (
    asset.stressScore * 0.4 +
    asset.fatigueImpact * 0.3 +
    asset.usageCount * 0.2 +
    (asset.riskLevel === 'high' ? 20 : 0)
  )
}
