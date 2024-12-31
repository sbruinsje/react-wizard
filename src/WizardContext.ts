import { createContext, ComponentType } from "react";
import { StepInstance, AnimationDirection, OpenStepOptions, CloseStepOptions } from "./types";

type WizardContextType = {
  stepHistory: StepInstance[];
  animate: boolean;
  animationDirection: AnimationDirection;
  enteringStep: StepInstance | null;
  currentStep: StepInstance | null;
  leavingStep: StepInstance | null;
  isInitialized: boolean;
  initialize: (initialStep: ComponentType<unknown>, initialProps: unknown) => void;
  openStep: <P>(component: ComponentType<P>, props: P, options?: OpenStepOptions) => string;
  closeStep: (options?: CloseStepOptions) => void;
  isClosing: (uuid: string) => boolean;
  afterStepEnter: (uuid: string) => void;
  afterStepLeave: (uuid: string) => void;
  closeWizard: () => void;
  registerOnDestroyHandler: (uuid: string, onDestroy: () => void) => void;
};
export const WizardContext = createContext<WizardContextType | undefined>(undefined);
