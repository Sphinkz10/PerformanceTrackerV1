import { LibraryAsset, AssetType } from '../types'

export function filterAssets(assets: LibraryAsset[], search: string, tab: AssetType | 'all'): LibraryAsset[] {
  const q = search.toLowerCase()

  return assets.filter(a => {
    const matchesTab = tab === 'all' || a.type === tab

    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.muscleGroups.some(m => m.toLowerCase().includes(q))

    return matchesTab && matchesSearch
  })
}
