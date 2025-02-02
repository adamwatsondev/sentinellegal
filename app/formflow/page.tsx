import { useState } from "react";
import StepOne from "./stepOne/page";
import StepTwo from "./stepTwo/page";

export default function FormFlow() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && <StepOne nextStep={() => setStep(2)} />}
      {step === 2 && <StepTwo prevStep={() => setStep(1)} databaseId={""} />}
    </div>
  );
}
