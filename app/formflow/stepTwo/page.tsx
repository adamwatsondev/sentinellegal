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

  // Get the current year and set the range for years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 83 }, (_, i) => currentYear - 100 + i);

  // Fetch the previously stored address and postcode from localStorage using databaseId
  const storedData = JSON.parse(localStorage.getItem(databaseId) || "{}");

  // Combine postcode, address, and personal details
  const finalData = {
    ...storedData,
    ...personalDetails,
  };

  const onSubmit = (data: FormData) => {
    // Store the form data in localStorage with the unique database ID
    localStorage.setItem(databaseId, JSON.stringify({ ...finalData, ...data }));

    // Mock sending data to a fictional endpoint
    console.log("Mock send data to server:", finalData);

    // Proceed with the form flow (e.g., show success message or next step)
    console.log("Personal details submitted:", data);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
    setValue(field, value); // Set the value in the form
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
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Your Personal Details</CardTitle>
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
                              <SelectItem key={title} value={title}>
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
                            value={personalDetails.dob_day}
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
                            value={personalDetails.dob_month}
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
                            value={personalDetails.dob_year}
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
