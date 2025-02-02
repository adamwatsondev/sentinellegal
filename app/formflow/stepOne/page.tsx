import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Define Zod schema for validation
const schema = z.object({
  postcode: z
    .string()
    .regex(/^[A-Za-z0-9]+$/, "Postcode must only contain letters and numbers"),
  address: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function StepOne({ nextStep }: { nextStep: () => void }) {
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

  const { handleSubmit, setValue, watch, formState } = form;

  useEffect(() => {
    // Log the form state and watch values to help with debugging
    console.log("Form State:", formState);
    console.log("Watched Values:", watch());
  }, [watch, formState]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    nextStep(); // Trigger the next step in the form
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
    <div className="flex flex-col items-center gap-4">
      <Card className="w-1/2">
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
    </div>
  );
}
