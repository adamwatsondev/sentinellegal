import { useEffect, useState } from "react";
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

// Zod schema for validation
const schema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .regex(
        /^[A-Za-z-]+$/,
        "First name must only contain letters and hyphens"
      ),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .regex(/^[A-Za-z-]+$/, "Last name must only contain letters and hyphens"),
    dob_day: z
      .number()
      .min(1, "Day is required")
      .max(31, "Day must be between 1 and 31"),
    dob_month: z
      .number()
      .min(1, "Month is required")
      .max(12, "Month must be between 1 and 12"),
    dob_year: z.number().min(1, "Year is required"),
    email: z.string().email("Please enter a valid email address"),
    title: z.string().min(1, "Please select a title"),
    mobile_number: z
      .string()
      .trim()
      .regex(/^\d+$/, "Mobile number must only contain numbers (remove spaces)")
      .min(10, "Mobile number must be at least 10 digits long")
      .max(15, "Mobile number must be no more than 15 digits long")
      .refine(
        (val) => val.length >= 10 && val.length <= 15,
        "Please enter a valid mobile number"
      ),
  })
  .superRefine((data, ctx) => {
    const { dob_day, dob_month, dob_year } = data;

    // Check if is a leap year
    const isLeapYear =
      dob_year % 4 === 0 && (dob_year % 100 !== 0 || dob_year % 400 === 0);
    // Ensure the day is valid for the selected month
    const daysInMonth: { [key: number]: number } = {
      1: 31,
      2: isLeapYear ? 29 : 28, // Leap year check for February
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
    if (dob_month in daysInMonth && dob_day > daysInMonth[dob_month]) {
      ctx.addIssue({
        path: ["dob_day"],
        message: "Date does not exist in this month",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

export default function StepTwo({
  prevStep,
  nextStep,
  databaseId,
}: {
  prevStep: () => void;
  nextStep: (id: string) => void;
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
      dob_day: 0,
      dob_month: 0,
      dob_year: 0,
      title: "",
      mobile_number: "",
    },
  });

  const { handleSubmit, setValue } = form;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 83 }, (_, i) => currentYear - 100 + i);

  const mockSendDataToServer = (data: FormData) => {
    console.log("Mock sending data to server:", data);
    // Place my mock API request here using POST
  };

  const onSubmit = (data: FormData) => {
    // Retrieve data from localStorage otrherwise use empty object
    const existingData = JSON.parse(localStorage.getItem("formData") || "{}");

    // Merge personal details data with existing step one data
    const updatedData = {
      ...existingData,
      firstName: data.firstName,
      lastName: data.lastName,
      dob_day: data.dob_day,
      dob_month: data.dob_month,
      dob_year: data.dob_year,
      mobile_number: data.mobile_number,
      title: data.title,
      databaseId: databaseId,
      email: data.email,
    };

    // Save updated data back to localStorage
    localStorage.setItem("formData", JSON.stringify(updatedData));

    // Send the data along with databaseId to the server for the mock API requests
    mockSendDataToServer(updatedData);

    // Log all details before moving to step three
    console.log("All details submitted:", updatedData);

    // Go to Step Three
    nextStep(databaseId);
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setPersonalDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValue(field, value);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const savedData = JSON.parse(localStorage.getItem("formData") || "{}");

    if (Object.keys(savedData).length > 0) {
      setPersonalDetails(savedData);

      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key as keyof FormData, value as string | number);
      });
    }
  }, [databaseId, setValue]);

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
                  <span>
                    We need these details so we can cross-reference any car
                    finance agreement(s) you had with your lender(s)
                  </span>
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
              {/* Names */}
              <div className="flex flex-col md:flex-row gap-4">
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
              </div>
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
                            value={personalDetails.dob_day?.toString()} // Convert number to string for the Select component
                            onValueChange={(e) =>
                              handleInputChange("dob_day", parseInt(e, 10))
                            } // Parse the string value back to a number
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
                            value={personalDetails.dob_month?.toString()}
                            onValueChange={(e) =>
                              handleInputChange("dob_month", parseInt(e, 10))
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
                            value={personalDetails.dob_year?.toString()}
                            onValueChange={(e) =>
                              handleInputChange("dob_year", parseInt(e, 10))
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
                          value={personalDetails.mobile_number}
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
            onClick={handleSubmit(onSubmit)}
            className="bg-[#c78e60] text-white"
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              localStorage.clear(); // Clear the localStorage before going back
              prevStep(); // Call the previous step function to go back
            }}
            className=" bg-black text-white rounded-md"
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
