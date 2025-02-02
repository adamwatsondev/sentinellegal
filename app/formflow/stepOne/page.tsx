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
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MainPoint from "@/components/elements/main-point";
import SecondaryPoint from "@/components/elements/secondary-point";

// Define Zod schema for validation
const schema = z.object({
  postcode: z
    .string()
    .regex(/^[A-Za-z0-9]+$/, "Postcode must only contain letters and numbers"),
  address: z.string(),
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
    // Generate a unique database ID after checking localStorage from the previous
    const lastUsedId = Number(localStorage.getItem("lastUsedId") || "0");
    const generatedId = (lastUsedId + 1).toString();
    localStorage.setItem("lastUsedId", generatedId);

    // Store postcode, address, and the generated ID in localStorage
    const stepOneData = {
      postcode: data.postcode,
      address: data.address,
      databaseId: generatedId,
    };

    // Store the data in localStorage under a consistent key
    localStorage.setItem("formData", JSON.stringify(stepOneData));

    // Proceed to the next step with the generated ID
    nextStep(generatedId);
  };

  const mockAddresses: { [key: string]: string[] } = {
    BN2: ["123 Main St", "456 Elm St", "789 Oak Rd"],
    BN1: ["1 Pine St", "2 Cedar Ave", "3 Birch Rd"],
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("postcode", value); // Let react-hook-form track the postcode
  };

  const handlePostcodeSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent page reset

    // Check if postcode exists in mockAddresses
    if (mockAddresses[watch("postcode")]) {
      setAddresses(mockAddresses[watch("postcode")]);
      setIsPostcodeSearched(true);
    } else {
      setAddresses([]);
      setIsPostcodeSearched(false);
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
          <CardTitle>Your current address</CardTitle>
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
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Current postcode"
                          onChange={handlePostcodeChange} // Use form state for postcode
                        />
                      </FormControl>
                      <Button
                        className="bg-[#c78e60]"
                        onClick={handlePostcodeSearch} // Prevent page reset
                        disabled={!watch("postcode")} // Disable if postcode is empty
                      >
                        Search
                      </Button>
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
                            onValueChange={handleAddressSelect} // When address selected
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an address" />
                            </SelectTrigger>
                            <SelectContent>
                              {addresses.map((address) => (
                                <SelectItem key={address} value={address}>
                                  {address}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
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
            type="submit" // Make sure it's submitting the form
            onClick={handleSubmit(onSubmit)} // Submit form
            disabled={!selectedAddress} // Only enable button when address is selected
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
