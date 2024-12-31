import React from "react";
import ReactDOM from "react-dom/client";
import { Wizard, useWizard } from "./main.ts";

const Step1 = () => {
  const { openStep } = useWizard();
  return <div onClick={() => openStep(Step2, {})}>Step 1</div>;
};

const Step2 = () => {
  const { openStep } = useWizard();
  return <div onClick={() => openStep(Step3, {})}>Step 2</div>;
};

const Step3 = () => {
  const { openStep } = useWizard();
  return <div onClick={() => openStep(Step1, {})}>Step 3</div>;
};

function App() {
  return (
    <>
      <Wizard initialStep={Step1} initialStepProps={{}} />
    </>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
