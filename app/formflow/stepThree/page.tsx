import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

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

  const clearSignature = () => {
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
  };

  const saveSignature = () => {
    if (signaturePad.current) {
      const signatureDataUrl = signaturePad.current.toDataURL();
      console.log("Saved Signature Data URL:", signatureDataUrl);
      mockSendDataToServer(signatureDataUrl, databaseId);
    }
  };

  const mockSendDataToServer = (
    signatureDataUrl: string,
    databaseId: string
  ) => {
    console.log("Mock send to server with signatureDataUrl and databaseId:", {
      signatureDataUrl,
      databaseId,
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
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
                  "sigCanvas border-2 sm:w-2/3 rounded-md border-[#c78e60]",
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
    </div>
  );
}
