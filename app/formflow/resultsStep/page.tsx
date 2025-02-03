import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ResultsStep({ prevStep }: { prevStep: () => void }) {
  const formData = JSON.parse(localStorage.getItem("formData") || "{}");

  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex flex-col gap-8 items-start">
        <div className="flex flex-row gap-4 items-center">
          <span className="text-[#c78e60] font-bold text-5xl">
            You are entitled to compensation
          </span>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <span className="text-black font-normal text-sm">
            Please get in touch with us{" "}
            <Link
              className="underline"
              href={"https://www.sentinellegal.co.uk/"}
            >
              <strong>here</strong>
            </Link>{" "}
            to discuss our process!
          </span>
        </div>

        {formData && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex gap-4">
              <span className="text-sm">
                Database ID for server-side pushing:
              </span>
              <span className="text-sm">{formData.databaseId}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Title:</span>
              <span className="text-sm">{formData.title}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">First Name:</span>
              <span className="text-sm">{formData.firstName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Last Name:</span>
              <span className="text-sm">{formData.lastName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Email:</span>
              <span className="text-sm">{formData.email}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Mobile Number:</span>
              <span className="text-sm">{formData.mobile_number}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Date of Birth:</span>
              <span className="text-sm">
                {formData.dob_day}/{formData.dob_month}/{formData.dob_year}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm">Address:</span>
              <span className="text-sm">
                {formData.address}, {formData.postcode}
              </span>
            </div>
            {/* Display the signature image */}
            {formData.signatureDataUrl && (
              <div className="flex gap-4 mt-4">
                <span className="text-sm">Signature:</span>
                <Image
                  src={formData.signatureDataUrl}
                  alt="User Signature"
                  className="border rounded-md"
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>
        )}
        <Button onClick={prevStep} className="bg-black text-white rounded-md">
          Back
        </Button>
      </div>
      <div className="flex flex-col gap-4 w-full sm:w-2/3">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How I would approach the server-side
            </AccordionTrigger>
            <AccordionContent>
              I would use MongoDB to store the form data by sending it POST
              requests of the localStorage JSON data like this example:
              <Image
                src="/images/mongo.png"
                alt="MongoDB"
                width={1000}
                height={1000}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
