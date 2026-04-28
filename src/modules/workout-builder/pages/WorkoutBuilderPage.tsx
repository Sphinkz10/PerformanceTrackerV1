import { WorkoutGraphCanvas } from '../components/WorkoutGraphCanvas'
import { ExerciseLibrarySidebar } from '../components/ExerciseLibrarySidebar'

export default function WorkoutBuilderPage() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden">
      <ExerciseLibrarySidebar />
      <WorkoutGraphCanvas />
    </div>
  )
}
