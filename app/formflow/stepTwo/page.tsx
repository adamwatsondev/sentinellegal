import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

// Define Zod schema for personal details validation
const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dob_day: z.number().min(1, "Day is required"),
  dob_month: z.number().min(1, "Month is required"),
  dob_year: z.number().min(1, "Year is required"),
  email: z.string().email("Please enter a valid email address"),
  title: z.string().min(1, "Title is required"),
  mobile_number: z.number().min(1, "Mobile number is required"),
});

type FormData = z.infer<typeof schema>;

export default function StepTwo({
  prevStep,
  databaseId,
}: {
  prevStep: () => void;
  databaseId: string;
}) {
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    email: "",
    title: "",
    mobile_number: "",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dob_day: 1,
      dob_month: 1,
      dob_year: 2007,
      title: "",
      mobile_number: 0,
    },
  });

  const { handleSubmit, setValue } = form;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 83 }, (_, i) => currentYear - 100 + i);

  const mockSendDataToServer = (data: unknown) => {
    console.log("Mock sending data to server:", data);
    // Example of a mock API request (to simulate data being saved on the server)
    // fetch("/api/save", { method: "POST", body: JSON.stringify(data) });
  };

  const onSubmit = (data: FormData) => {
    // Retrieve existing data (if any) from localStorage
    const existingData = JSON.parse(localStorage.getItem("formData") || "{}");

    // Merge new data with existing data (preserve previous fields)
    const updatedData = {
      ...existingData, // Includes postcode, address, and other fields from StepOne
      firstName: data.firstName,
      lastName: data.lastName,
      dob_day: data.dob_day,
      dob_month: data.dob_month,
      dob_year: data.dob_year,
      mobile_number: data.mobile_number,
      title: data.title,
      databaseId: databaseId, // Use databaseId prop here
    };

    // Save updated data back to localStorage
    localStorage.setItem("formData", JSON.stringify(updatedData));

    // Send the data along with databaseId to the server (mock)
    mockSendDataToServer(updatedData);

    // Log final data for debugging
    console.log("All details submitted:", updatedData);

    // Proceed to the next step, passing the databaseId if required
    // nextStep(databaseId); // If necessary, use databaseId for continuity
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setPersonalDetails((prev) => ({
      ...prev,
      [field]:
        field.includes("dob") || field === "mobile_number"
          ? Number(value)
          : value,
    }));
    setValue(
      field,
      field.includes("dob") || field === "mobile_number" ? Number(value) : value
    );
  };

  const titles = [
    "Mr",
    "Mrs",
    "Ms",
    "Miss",
    "Dr",
    "Prof",
    "Rev",
    "Sir",
    "Lady",
    "Lord",
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-black font-bold">Your Personal Details</span>
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
                  <p>
                    We need these details so we can cross-reference any car
                    finance agreement(s) you had with your lender(s)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Please enter some information about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-8">
              {/* Title */}
              <FormItem>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={personalDetails.title}
                          onValueChange={(e) => handleInputChange("title", e)}
                        >
                          <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="..." />
                          </SelectTrigger>
                          <SelectContent>
                            {titles.map((title) => (
                              <SelectItem
                                className="hover:cursor-pointer"
                                key={title}
                                value={title}
                              >
                                {title}
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
              {/* First Name */}
              <FormItem>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="..."
                          value={personalDetails.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  )}
                />
              </FormItem>
              {/* Last Name */}
              <FormItem>
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="..."
                          value={personalDetails.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  )}
                />
              </FormItem>
              {/* Email */}
              <FormItem>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="..."
                          value={personalDetails.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  )}
                />
              </FormItem>
              {/* Date of Birth */}
              <div className="flex justify-between gap-4">
                <FormItem className="w-1/3">
                  <FormField
                    control={form.control}
                    name="dob_day"
                    render={({ field }) => (
                      <>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={personalDetails.dob_day.toString()} // Ensure it's a string
                            onValueChange={(e) =>
                              handleInputChange("dob_day", e)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1}
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
                <FormItem className="w-1/3">
                  <FormField
                    control={form.control}
                    name="dob_month"
                    render={({ field }) => (
                      <>
                        <FormLabel className="text-transparent">.</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={personalDetails.dob_month.toString()} // Ensure it's a string
                            onValueChange={(e) =>
                              handleInputChange("dob_month", e)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1}
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
                <FormItem className="w-1/3">
                  <FormField
                    control={form.control}
                    name="dob_year"
                    render={({ field }) => (
                      <>
                        <FormLabel className="text-transparent">.</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={personalDetails.dob_year.toString()} // Ensure it's a string
                            onValueChange={(e) =>
                              handleInputChange("dob_year", e)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="..." />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
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
              </div>
              {/* Mobile number */}
              <FormItem>
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="..."
                          value={personalDetails.mobile_number.toString()}
                          onChange={(e) =>
                            handleInputChange("mobile_number", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  )}
                />
              </FormItem>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex gap-4 justify-start">
          <Button
            onClick={handleSubmit(onSubmit)} // Submit form
            className="bg-[#c78e60] text-white"
          >
            Submit
          </Button>
          <Button
            onClick={prevStep}
            className=" bg-black text-white rounded-md"
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
