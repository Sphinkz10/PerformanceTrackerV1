import { useState } from 'react'
import { useExerciseDraftStore } from '../store/useExerciseDraftStore'
import { ExerciseForm } from '../components/ExerciseForm'
import { ExercisePreview } from '../components/ExercisePreview'
import { ExerciseFormHeader } from '../components/ExerciseFormHeader'
import { exerciseService } from '../../../services/exercise.service'

export default function ExerciseCreatorPage() {
  const draft = useExerciseDraftStore(s => s.draft)
  const validateDraft = useExerciseDraftStore(s => s.validateDraft)
  const markSaved = useExerciseDraftStore(s => s.markSaved)
  const setSaveStatus = useExerciseDraftStore(s => s.setSaveStatus)
  const [errors, setErrors] = useState<string[]>([])

  const handleSave = async () => {
    setErrors([])
    const validation = validateDraft()
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }
    setSaveStatus('saving')
    try {
      await exerciseService.saveDraft(draft)
      markSaved()
    } catch {
      setErrors(['Erro ao guardar. Tente novamente.'])
      setSaveStatus('error')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <ExerciseFormHeader onSave={handleSave} errors={errors} />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="overflow-y-auto pr-2">
          <ExerciseForm />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <ExercisePreview />
          </div>
        </aside>
      </div>
      <div className="mt-6 lg:hidden">
        <ExercisePreview />
      </div>
    </div>
  )
}
