"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast, Toaster } from "sonner";

export default function StepThree({
  prevStep,
  nextStep,
  databaseId,
}: {
  prevStep: () => void;
  nextStep: (id: string) => void;
  databaseId: string;
}) {
  const signaturePad = useRef<SignatureCanvas | null>(null);
  interface FormData {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile_number: number;
    dob_day: number;
    dob_month: number;
    dob_year: number;
    address: string;
    postcode: string;
  }

  const [updatedData, setUpdatedData] = useState<FormData | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem("formData") || "{}");
    setUpdatedData(existingData);
  }, []);

  const clearSignature = () => {
    if (signaturePad.current) {
      signaturePad.current.clear();
      toast.success(
        "Signature cleared successfully! Saved signatures will remain saved until a new signature is added."
      );
    }
  };

  const saveSignature = () => {
    if (signaturePad.current) {
      const signatureDataUrl = signaturePad.current.toDataURL();
      console.log("Saved Signature Data URL:", signatureDataUrl);

      // Save signature along with updatedData in localStorage
      const formData = JSON.parse(localStorage.getItem("formData") || "{}");
      const updatedFormData = { ...formData, signatureDataUrl };

      localStorage.setItem("formData", JSON.stringify(updatedFormData));
      setSignatureDataUrl(signatureDataUrl);
      toast.success("Signature saved successfully!");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [databaseId]);

  return (
    <div>
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-8 items-start">
          <span className="text-black text-left font-bold text-3xl">
            Provided Information
          </span>

          {updatedData && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <span className="text-sm">Title:</span>
                <span className="text-sm">{updatedData.title}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">First Name:</span>
                <span className="text-sm">{updatedData.firstName}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">Last Name:</span>
                <span className="text-sm">{updatedData.lastName}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">Email:</span>
                <span className="text-sm">{updatedData.email}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">Mobile Number:</span>
                <span className="text-sm">{updatedData.mobile_number}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">Date of Birth:</span>
                <span className="text-sm">
                  {updatedData.dob_day}/{updatedData.dob_month}/
                  {updatedData.dob_year}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm">Address:</span>
                <span className="text-sm">
                  {updatedData.address}, {updatedData.postcode}
                </span>
              </div>
            </div>
          )}
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Provide your signature</CardTitle>
            <CardDescription>
              By adding your signature, you agree that all information you have
              entered is accurate and complete.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <SignatureCanvas
              ref={signaturePad}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className:
                  "sigCanvas border-2 w-2/3 rounded-md border-[#c78e60]",
              }}
            />
            <div className="flex justify-end flex-col gap-4">
              <Button
                onClick={clearSignature}
                className="bg-red-500 text-white"
              >
                Clear
              </Button>
              <Button
                onClick={saveSignature}
                className="bg-green-500 text-white"
              >
                Save
              </Button>

              <Button
                onClick={() => nextStep(databaseId)}
                className="bg-[#c78e60] text-white"
                disabled={!signatureDataUrl}
              >
                Next
              </Button>
              <Button
                onClick={prevStep}
                className=" bg-black text-white rounded-md"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
