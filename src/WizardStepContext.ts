import { createContext } from "react";

type WizardStepContextType = { uuid: string };
export const WizardStepContext = createContext<WizardStepContextType | undefined>(undefined);
