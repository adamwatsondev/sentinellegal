import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/layout/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MainPoint from "@/components/elements/main-point";
import SecondaryPoint from "@/components/elements/secondary-point";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel Legal",
  description: "Finance agreement checker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col gap-20 px-20`}
      >
        <div className="flex flex-col min-h-screen gap-16 mt-40">
          <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md h-16">
            <Header />
          </div>
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
                Join <strong>850,000+</strong> people and check in under 60
                seconds to see if you&apos;re owed compensation. Use the free
                agreement finder to start your claim
              </span>
            </div>
          </div>
          <div>{children}</div>

          <div className="flex flex-col gap-4 w-full">
            <span className="text-black font-boldtext-5xl">FAQ</span>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I determine if I qualify for compensation?
                </AccordionTrigger>
                <AccordionContent>
                  If you&apos;ve had a finance agreement like PCP or HP before
                  2021, you may be eligible for compensation due to mis-selling.
                  Check your eligibility by filling out our online form
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What criteria must I meet to make a claim?
                </AccordionTrigger>
                <AccordionContent>
                  Your lender must have failed to disclose the commission
                  details on your agreement(s). If your finance details were
                  inadequately explained or you faced higher interest rates due
                  to commissions, you could be eligible for £1,000s. Check our
                  free online form to see if you meet the criteria
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Does the type of agreement matter (PCP vs HP)?
                </AccordionTrigger>
                <AccordionContent>
                  Don&apos;t worry if you had an HP loan instead of a PCP
                  agreement - we accept claims for various vehicle finance
                  agreements. Start your claim today with our online form
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </body>
    </html>
  );
}
