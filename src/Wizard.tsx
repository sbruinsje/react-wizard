import clsx from "clsx";
import { ComponentType, useContext, useEffect } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import { WizardContext } from "./WizardContext";
import { WizardProvider } from "./WizardProvider";
import { WizardStepProvider } from "./WizardStepProvider";

type WizardProps = {
  initialStep: ComponentType<unknown>;
  initialStepProps: unknown;
  onCloseWizard?: () => void;
};
export const Wizard = ({ initialStep, initialStepProps, onCloseWizard }: WizardProps) => {
  // The wizard component logic is wrapped in a WizardInternal component so
  // that it has access to the context provided by WizardProvider.

  return (
    <WizardProvider onCloseWizard={onCloseWizard}>
      <WizardInternal initialStep={initialStep} initialStepProps={initialStepProps} />
    </WizardProvider>
  );
};

type WizardInternalProps = WizardProps;
export const WizardInternal = ({ initialStep, initialStepProps }: WizardInternalProps) => {
  const context = useContext(WizardContext);
  if (context === undefined) throw new Error("WizardContext must be used within a provider");

  const {
    animate,
    animationDirection,
    enteringStep,
    currentStep,
    leavingStep,
    isInitialized,
    initialize,
    isClosing,
    afterStepEnter,
    afterStepLeave,
  } = context;
  const activeSteps = [currentStep, enteringStep, leavingStep].filter((val) => val !== null);

  // If animations are disabled for the current step change, we set the duration to 0. We can't
  // disable the transition entirely because we need afterStepEnter/afterStepLeave to be called.
  const animationDuration = animate ? "duration-300" : "duration-0";

  const enterFrom = animationDirection === "forward" ? "right" : "left";
  const leaveTo = animationDirection === "forward" ? "left" : "right";
  const enterToClasses = "translate-x-0 opacity-100";
  const leaveFromClasses = enterToClasses;
  const enterFromClasses = enterFrom === "right" ? "translate-x-full" : "-translate-x-full";
  const leaveToClasses = leaveTo === "left" ? "-translate-x-full" : "translate-x-full";

  useEffect(() => {
    if (!isInitialized) initialize(initialStep, initialStepProps);
  });

  return (
    <>
      {activeSteps.map((step) => {
        const StepComponent = step.component as ComponentType<unknown>;

        return (
          <WizardStepProvider key={step.uuid} uuid={step.uuid}>
            <Transition
              key={step.uuid}
              as="div"
              className="StepRoot fixed inset-0"
              show={!isClosing(step.uuid)}
              appear={true}
              afterEnter={() => afterStepEnter(step.uuid)}
              afterLeave={() => afterStepLeave(step.uuid)}
            >
              <TransitionChild
                as="div"
                className={clsx(
                  "StepComponentWrapper fixed inset-0 flex items-center justify-center",
                )}
                enter={`transition-all ease-in-out ${animationDuration} delay-[100ms]`}
                enterFrom={enterFromClasses}
                enterTo={enterToClasses}
                leave={`transition-all ease-out ${animationDuration}`}
                leaveFrom={leaveFromClasses}
                leaveTo={leaveToClasses}
              >
                <StepComponent {...(step.props as object)} />
              </TransitionChild>
            </Transition>
          </WizardStepProvider>
        );
      })}
    </>
  );
};
