import { NameInput } from './NameInput'
import { CategorySelector } from './CategorySelector'
import { MuscleGroupGrid } from './MuscleGroupGrid'
import { EquipmentSelector } from './EquipmentSelector'
import { DifficultySelector } from './DifficultySelector'
import { IconPicker } from './IconPicker'
import { DescriptionArea } from './DescriptionArea'
import { BaseFields } from './BaseFields'
import { CustomFields } from './CustomFields'

export function ExerciseForm() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-medium mb-4">Identidade</h2>
        <div className="space-y-4">
          <NameInput />
          <CategorySelector />
          <MuscleGroupGrid />
          <EquipmentSelector />
          <DifficultySelector />
          <IconPicker />
          <DescriptionArea />
        </div>
      </section>
      <section>
        <h2 className="font-display text-lg font-medium mb-4">Campos de Dados</h2>
        <BaseFields />
        <div className="mt-6"><CustomFields /></div>
      </section>
    </div>
  )
}
