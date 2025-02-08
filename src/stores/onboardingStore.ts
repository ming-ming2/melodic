// stores/onboardingStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStore {
  hasSeenTutorial: boolean
  setHasSeenTutorial: (value: boolean) => void
}

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      setHasSeenTutorial: (value) => set({ hasSeenTutorial: value }),
    }),
    {
      name: 'melodic-onboarding',
    }
  )
)

export default useOnboardingStore
