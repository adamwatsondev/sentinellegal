import { useState, useEffect } from "react";
import StepOne from "./stepOne/page";
import StepTwo from "./stepTwo/page";
import StepThree from "./stepThree/page";

export default function FormFlow() {
  // Retrieve saved step and databaseId
  const [step, setStep] = useState<number>(() => {
    return Number(localStorage.getItem("currentStep")) || 1;
  });

  const [databaseId, setDatabaseId] = useState<string>(() => {
    return localStorage.getItem("databaseId") || "";
  });

  // Save step to localStorage to allow storage to stay after reload
  useEffect(() => {
    localStorage.setItem("currentStep", step.toString());
  }, [step]);

  // Move to next step with the databaseId
  const nextStep2 = (id: string) => {
    setDatabaseId(id);
    localStorage.setItem("databaseId", id);
    setStep(2);
  };

  const nextStep3 = (id: string) => {
    setDatabaseId(id);
    localStorage.setItem("databaseId", id);
    setStep(3);
  };

  const nextStep4 = (id: string) => {
    setDatabaseId(id);
    localStorage.setItem("databaseId", id);
    setStep(4);
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
      {step === 1 && <StepOne nextStep={nextStep2} />}
      {step === 2 && (
        <StepTwo
          nextStep={nextStep3}
          prevStep={() => setStep(1)}
          databaseId={databaseId}
        />
      )}
      {step === 3 && (
        <StepThree
          nextStep={nextStep4}
          prevStep={() => setStep(2)}
          databaseId={databaseId}
        />
      )}
    </div>
  );
}
