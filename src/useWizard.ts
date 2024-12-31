import { useContext, useEffect, useMemo, useRef } from "react";
import { WizardStepContext } from "./WizardStepContext";
import { WizardContext } from "./WizardContext";
import { StepInstance } from "./types";

/**
 * This hook is used to open/close steps. It hides the internal implementation
 * of the Wizard from the developer. It provides a simple API to open/close steps. You should
 * never have to use the WizardContext directly, only through this hook.
 */

type OnStepDestroy = (() => void) | undefined;
type UseWizardProps = {
  onStepDestroy?: OnStepDestroy;
};

export const useWizard = ({ onStepDestroy }: UseWizardProps = {}) => {
  const stepDestroyHandler = useRef<OnStepDestroy>(onStepDestroy);

  const wizardContext = useContext(WizardContext);
  if (wizardContext === undefined)
    throw new Error("useWizard must be used within a WizardContext provider");

  const wizardStepContext = useContext(WizardStepContext);
  if (wizardStepContext === undefined)
    throw new Error("useWizard must be used within a WizardStepContext provider");

  const { uuid } = wizardStepContext;
  const closeStep = wizardContext.closeStep;
  const openStep = wizardContext.openStep;
  const closeWizard = wizardContext.closeWizard;

  useEffect(() => {
    if (stepDestroyHandler.current) {
      wizardContext.registerOnDestroyHandler(uuid, stepDestroyHandler.current);
    }
  }, [stepDestroyHandler, uuid, wizardContext]);

  const stepHistory = useMemo(() => {
    wizardContext.stepHistory.map((step: StepInstance) => step.uuid);
  }, [wizardContext.stepHistory]);

  return {
    uuid,
    closeStep,
    openStep,
    closeWizard,
    stepHistory,
  };
};
