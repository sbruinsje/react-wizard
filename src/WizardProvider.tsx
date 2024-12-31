import { ComponentType, useState, ReactNode } from "react";
import { WizardContext } from "./WizardContext";
import {
  StepInstance,
  AnimationDirection,
  EmptyObject,
  OpenStepOptions,
  CloseStepOptions,
} from "./types";

type WizardProviderProps = {
  children: ReactNode;
  onCloseWizard?: () => void;
};

export const WizardProvider = ({ children, onCloseWizard }: WizardProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [animationDirection, setAnimationDirection] = useState<AnimationDirection>("forward");
  const [stepHistory, setStepHistory] = useState<StepInstance[]>([]);
  const [enteringStep, setEnteringStep] = useState<StepInstance | null>(null);
  const [currentStep, setCurrentStep] = useState<StepInstance | null>(null);
  const [leavingStep, setLeavingStep] = useState<StepInstance | null>(null);

  const isAnimating = Boolean(enteringStep || leavingStep);

  function initialize(initialStep: ComponentType<unknown>, initialProps: unknown) {
    if (isInitialized) {
      console.warn("Wizard already initialized");
      return;
    }
    openStep(initialStep, initialProps, { animate: false });
    setIsInitialized(true);
  }

  function openStep<P = EmptyObject>(
    component: ComponentType<P>,
    props: P,
    options: OpenStepOptions = {},
  ) {
    if (isAnimating) throw new Error("Cannot open a step while another step is opening or closing");
    const {
      direction = "forward",
      keepInHistory = true,
      purgeHistory = false,
      animate = true,
    } = options;

    setAnimate(animate);
    setAnimationDirection(direction);

    // Add the current step to the step history
    if (currentStep?.keepInHistory) setStepHistory([...stepHistory, currentStep as StepInstance]);

    // If purgeHistory is true, remove all steps from history. The new step will be the first one.
    if (purgeHistory) {
      // TODO: call onDestory for all purged steps
      setStepHistory([]);
    }

    // Start the leave animation of the current step (if there is one)
    const stepToLeave = currentStep ?? null;
    if (stepToLeave) {
      setCurrentStep(null);
      setLeavingStep(stepToLeave);
    }

    // Start the enter animation of the new step
    const uuid = self.crypto.randomUUID();
    const step: StepInstance<P> = { uuid, component, props, keepInHistory };
    setEnteringStep(step as StepInstance);

    return uuid;
  }

  function closeStep(options: CloseStepOptions = {}) {
    const step = currentStep ?? null;
    if (!step) throw new Error(`There is no opened step to be closed`);

    const { direction = "backward", animate = true } = options;

    setAnimate(animate);
    setAnimationDirection(direction);

    const previousStep = stepHistory.at(-1) ?? null;

    // Discard the previous step from the step history (as it will become the current step)
    setStepHistory(stepHistory.slice(0, -1));

    // Start the enter animation of the previous step (if there was one)
    if (previousStep) setEnteringStep(previousStep);

    // Destroy the current step as it is being closed
    if (step.onDestroy) step.onDestroy();

    // Start the leave animation of the current step
    setCurrentStep(null);
    setLeavingStep(step);
  }

  function afterStepEnter(uuid: string) {
    const step = enteringStep?.uuid === uuid ? enteringStep : null;
    if (!step) throw new Error(`Step with uuid ${uuid} is not currently opening`);

    setEnteringStep(null);
    setCurrentStep(step);
  }

  function afterStepLeave(uuid: string) {
    const step = leavingStep?.uuid === uuid ? leavingStep : null;
    if (!step) throw new Error(`Step with uuid ${uuid} is not currently closing`);
    setLeavingStep(null);

    // If this was the last step, close the wizard
    if (!currentStep && !enteringStep) {
      closeWizard();
    }
  }

  function isClosing(uuid: string) {
    return leavingStep?.uuid === uuid;
  }

  function registerOnDestroyHandler(uuid: string, onDestroy: () => void) {
    const step = [enteringStep, currentStep, leavingStep, ...stepHistory]
      .filter((stepInstance) => stepInstance !== null && stepInstance.uuid === uuid)
      .pop();
    if (!step) throw new Error("Cannot register onDestroy handler for non existing step instance");
    step.onDestroy = onDestroy;
  }

  function closeWizard() {
    // TODO:
    // should we do cleanup here? Maybe each step should have its own destroy() method and
    // this closeWizard() method should destroy each step in the current history of the wizard?

    if (onCloseWizard) onCloseWizard();
  }

  const context = {
    stepHistory,
    animate,
    animationDirection,
    enteringStep: enteringStep,
    currentStep: currentStep,
    leavingStep: leavingStep,
    isInitialized,
    initialize,
    openStep,
    closeStep,
    isClosing,
    afterStepEnter,
    afterStepLeave,
    closeWizard,
    registerOnDestroyHandler,
  };

  return <WizardContext.Provider value={context}>{children}</WizardContext.Provider>;
};
