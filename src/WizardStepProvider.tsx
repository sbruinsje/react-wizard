import { ReactNode } from "react";
import { WizardStepContext } from "./WizardStepContext";

type WizardStepProviderProps = { children: ReactNode; uuid: string };
export const WizardStepProvider = ({ children, uuid }: WizardStepProviderProps) => {
  return <WizardStepContext.Provider value={{ uuid }}>{children}</WizardStepContext.Provider>;
};
