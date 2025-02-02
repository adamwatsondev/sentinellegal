import { useState, useEffect } from "react";
import StepOne from "./stepOne/page";
import StepTwo from "./stepTwo/page";

export default function FormFlow() {
  // Retrieve saved step and databaseId if available
  const [step, setStep] = useState<number>(() => {
    return Number(localStorage.getItem("currentStep")) || 1;
  });

  const [databaseId, setDatabaseId] = useState<string>(() => {
    return localStorage.getItem("databaseId") || "";
  });

  // Save step to localStorage to persist between reloads
  useEffect(() => {
    localStorage.setItem("currentStep", step.toString());
  }, [step]);

  // Function to handle moving to the next step with databaseId
  const nextStep = (id: string) => {
    setDatabaseId(id);
    localStorage.setItem("databaseId", id);
    setStep(2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-4 font-semibold">
        <span className={step === 1 ? "text-[#c78e60]" : "text-gray-500"}>
          Step 1
        </span>
        {">"}
        <span className={step === 2 ? "text-[#c78e60]" : "text-gray-500"}>
          Step 2
        </span>
        {">"}
        <span className={step === 3 ? "text-[#c78e60]" : "text-gray-500"}>
          Step 3
        </span>
        {">"}
        <span className={step === 4 ? "text-[#c78e60]" : "text-gray-500"}>
          Results
        </span>
      </div>
      {step === 1 && <StepOne nextStep={nextStep} />}
      {step === 2 && (
        <StepTwo prevStep={() => setStep(1)} databaseId={databaseId} />
      )}
    </div>
  );
}
