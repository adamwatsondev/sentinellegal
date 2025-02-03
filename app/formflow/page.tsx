"use client";

import { useState, useEffect } from "react";
import StepOne from "./stepOne/page";
import StepTwo from "./stepTwo/page";
import StepThree from "./stepThree/page";
import ResultsStep from "./resultsStep/page";

export default function FormFlow() {
  const [step, setStep] = useState<number | null>(null);
  const [databaseId, setDatabaseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentStep = localStorage.getItem("currentStep");
    const savedDatabaseId = localStorage.getItem("databaseId");

    // Use the saved step if it exists
    if (currentStep) {
      setStep(Number(currentStep));
    } else {
      setStep(1); // or default to step 1
    }

    // Use the saved databaseId if it exists
    if (savedDatabaseId) {
      setDatabaseId(savedDatabaseId);
    }

    setLoading(false);
  }, []);

  // Save step to localStorage whenever it changes
  useEffect(() => {
    if (step !== null) {
      localStorage.setItem("currentStep", step.toString());
    }
  }, [step]);

  // Move to next steps with the databaseId
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

  const resultsStep = (id: string) => {
    setDatabaseId(id);
    localStorage.setItem("databaseId", id);
    setStep(4);
  };

  // Show loader while loading state is true
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
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
          nextStep={resultsStep}
          prevStep={() => setStep(2)}
          databaseId={databaseId}
        />
      )}
      {step === 4 && <ResultsStep prevStep={() => setStep(3)} />}
    </div>
  );
}
