import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MainPoint from "@/components/elements/main-point";
import SecondaryPoint from "@/components/elements/secondary-point";
import Image from "next/image";

// Schema for validation
const schema = z.object({
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Postcode must only contain letters and numbers (including spaces)"
    )
    .refine(
      (val) => val.length >= 5 && val.length <= 8,
      "Postcode must be between 5 and 8 characters long"
    ), // Between 5 to 8 characters
  address: z.string().min(1, "Please select an address"),
});

type FormData = z.infer<typeof schema>;

export default function StepOne({
  nextStep,
}: {
  nextStep: (id: string) => void;
}) {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined
  );
  const [isPostcodeSearched, setIsPostcodeSearched] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      postcode: "",
      address: "",
    },
  });

  const { handleSubmit, setValue, watch } = form;

  const onSubmit = (data: FormData) => {
    // Generate a unique database ID after checking localStorage from the previously stored ID
    const lastUsedId = Number(localStorage.getItem("lastUsedId") || "0");
    const generatedId = (lastUsedId + 1).toString();
    localStorage.setItem("lastUsedId", generatedId);

    // Store Step One data in localStorage
    const stepOneData = {
      postcode: data.postcode,
      address: data.address,
      databaseId: generatedId,
    };

    // Store the data in localStorage under a JSON key
    localStorage.setItem("formData", JSON.stringify(stepOneData));

    nextStep(generatedId);
  };

  const mockAddresses: { [key: string]: string[] } = {
    BN13JF: [
      "1 Nyetimber Hill",
      "2 Nyetimber Hill",
      "3 Nyetimber Hill",
      "4 Nyetimber Hill",
      "5 Nyetimber Hill",
    ],
    BN24TL: [
      "1 Green Lane",
      "2 Green Lane",
      "3 Green Lane",
      "4 Green Lane",
      "5 Green Lane",
    ],
    RH10AX: [
      "1 Oakwood Drive",
      "2 Oakwood Drive",
      "3 Oakwood Drive",
      "4 Oakwood Drive",
      "5 Oakwood Drive",
    ],
    BN99HT: [
      "1 Cedar Road",
      "2 Cedar Road",
      "3 Cedar Road",
      "4 Cedar Road",
      "5 Cedar Road",
    ],
    PO19BL: [
      "1 High Street",
      "2 High Street",
      "3 High Street",
      "4 High Street",
      "5 High Street",
    ],
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("postcode", value);
  };

  const handlePostcodeSearch = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Prevent page reset

    // Validate postcode first
    const isValid = await form.trigger("postcode");

    if (isValid) {
      // Check if postcode exists in mockAddresses
      if (mockAddresses[watch("postcode")]) {
        setAddresses(mockAddresses[watch("postcode")]);
        setIsPostcodeSearched(true);
      } else {
        setAddresses([]);
        setIsPostcodeSearched(false);
      }
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setValue("address", address); // Set the address value in the form
  };

  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex flex-col gap-8 items-start">
        <div className="flex flex-row gap-4 items-center">
          <MainPoint />
          <span className="text-[#c78e60] font-bold text-2xl">
            The average claim value is <strong>£5,318</strong>* per finance
            agreement.
          </span>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <SecondaryPoint />
          <span className="text-black font-normal text-sm">
            Join <strong>850,000+</strong> people and check in under 60 seconds
            to see if you&apos;re owed compensation. Use the free agreement
            finder to start your claim
          </span>
        </div>
      </div>
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Your current address</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src="/images/info-icon.png"
                    alt="Info"
                    width={25}
                    height={25}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-[#c78e60] text-white">
                  <span>
                    *psst* *hey* *over here* these are the postcodes that work
                    for demo purposes: BN13JF, BN24TL, RH10AX, BN99HT, PO19BL
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Enter your postcode below and tap Search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormItem>
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-full flex gap-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Current postcode"
                            onChange={handlePostcodeChange}
                          />
                        </FormControl>
                        <Button
                          className="bg-[#c78e60]"
                          onClick={handlePostcodeSearch}
                          // disabled={!watch("postcode")} removed to allow form validation
                        >
                          Search
                        </Button>
                      </div>
                      <FormMessage />
                    </div>
                  )}
                />
              </FormItem>

              {isPostcodeSearched && addresses.length > 0 && (
                <FormItem>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <>
                        <FormLabel>Select Address</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={selectedAddress}
                            onValueChange={handleAddressSelect}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an address" />
                            </SelectTrigger>
                            <SelectContent>
                              {addresses.map((address) => (
                                <SelectItem
                                  key={address}
                                  value={address}
                                  className="hover:cursor-pointer"
                                >
                                  {address}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </>
                    )}
                  />
                </FormItem>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-[#c78e60]"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            // disabled={!selectedAddress} removed to allow form validation
          >
            Next
          </Button>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-4 w-full">
        <span className="text-black font-boldtext-5xl">FAQ</span>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How do I determine if I qualify for compensation?
            </AccordionTrigger>
            <AccordionContent>
              If you&apos;ve had a finance agreement like PCP or HP before 2021,
              you may be eligible for compensation due to mis-selling. Check
              your eligibility by filling out our online form
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What criteria must I meet to make a claim?
            </AccordionTrigger>
            <AccordionContent>
              Your lender must have failed to disclose the commission details on
              your agreement(s). If your finance details were inadequately
              explained or you faced higher interest rates due to commissions,
              you could be eligible for £1,000s. Check our free online form to
              see if you meet the criteria
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Does the type of agreement matter (PCP vs HP)?
            </AccordionTrigger>
            <AccordionContent>
              Don&apos;t worry if you had an HP loan instead of a PCP agreement
              - we accept claims for various vehicle finance agreements. Start
              your claim today with our online form
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
