import { createContext } from 'react';

export const ImplementationGuideContext = createContext<{
  completedSteps: number[];
  onCompleteStep: (step: number) => void;
}>({
  completedSteps: [],
  onCompleteStep: () => {}
});
