"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Users,
  Zap,
  ScanLine,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, useInView } from "framer-motion";

export default function LandingPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const isInView1 = useInView(ref1, { once: true });
  const isInView2 = useInView(ref2, { once: true });
  const isInView3 = useInView(ref3, { once: true });
  const isInView4 = useInView(ref4, { once: true });

  const popInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white text-[#6A7573]">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white p-4 shadow-sm sm:flex-row md:p-6"
      >
        <div className="mb-4 text-2xl font-bold text-[#6A7573] sm:mb-0">
          ShareFare
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/login"
                className="transition-colors duration-200 hover:text-[#4A5554]"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </motion.header>

      <main>
        <section className="px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <motion.div
                className="mb-10 lg:mb-0 lg:w-1/2"
                initial="hidden"
                animate="visible"
                variants={popInVariants}
              >
                <h1 className="mb-6 text-4xl font-bold leading-tight text-[#6A7573] sm:text-5xl md:text-6xl lg:text-7xl">
                  Split Bills,
                  <br />
                  <span className="text-[#4A5554]">Not Friendships</span>
                </h1>
                <p className="mb-8 text-xl leading-relaxed text-[#6A7573] sm:text-2xl">
                  ShareFare makes dividing restaurant bills a breeze. Say goodbye
                  to awkward calculations and hello to hassle-free dining
                  experiences.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button
                    className="w-full rounded-full bg-[#DBFBC9] px-8 py-6 text-lg text-[#6A7573] transition-colors duration-200 hover:bg-[#C5E4B4] sm:w-auto"
                    onClick={() =>
                      document
                        .getElementById("signup")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#6A7573] px-8 py-6 text-lg text-[#6A7573] transition-colors duration-200 hover:bg-[#F0F9E8] sm:w-auto"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
              <motion.div 
                className="mt-10 lg:mt-0 lg:w-1/2"
                initial="hidden"
                animate="visible"
                variants={popInVariants}
              >
                <div className="relative h-[550px] w-full overflow-hidden rounded-2xl bg-[#F0F9E8] shadow-lg">
                  <div className="absolute left-1/2 top-1/2 h-[92%] w-[90%] -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-white p-6 shadow-md sm:w-[85%] sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-[#6A7573]">
                        Dinner with Friends
                      </h3>
                      <span className="text-2xl font-bold text-[#4A5554]">
                        $100.00
                      </span>
                    </div>
                    <div className="mb-4 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">Pizza</span>
                          <div className="flex -space-x-2">
                            <Avatar className="h-10 w-10 border-2 border-[#6A7573] bg-[#DBFBC9] text-[#6A7573]">
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-10 w-10 border-2 border-[#6A7573] bg-[#4A5554] text-[#6A7573]">
                              <AvatarFallback>B</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <span className="text-lg font-medium">$40.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">Pasta</span>
                          <Avatar className="h-10 w-10 border-2 border-[#6A7573] bg-[#C5E4B4] text-[#6A7573]">
                            <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="text-lg font-medium">$30.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">Salad</span>
                          <div className="flex -space-x-2">
                            <Avatar className="h-10 w-10 border-2 border-[#6A7573] bg-[#6A7573] text-[#6A7573]">
                              <AvatarFallback>D</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-10 w-10 border-2 border-[#6A7573] bg-[#DBFBC9] text-[#6A7573]">
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <span className="text-lg font-medium">$30.00</span>
                      </div>
                    </div>
                    <div className="mb-8 space-y-3">
                      <div className="flex items-center justify-between text-base">
                        <span className="text-[#6A7573]">Subtotal:</span>
                        <span className="font-medium">$100.00</span>
                      </div>
                      <div className="flex items-center justify-between text-base">
                        <span className="text-[#6A7573]">Tax (10%):</span>
                        <span className="font-medium">$10.00</span>
                      </div>
                      <div className="flex items-center justify-between text-base">
                        <span className="text-[#6A7573]">Tip (15%):</span>
                        <span className="font-medium">$15.00</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#C5E4B4] pt-2 text-lg font-semibold">
                        <span>Total:</span>
                        <span>$125.00</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-between rounded-2xl bg-[#F0F9E8] px-6 py-1.5 text-xl font-semibold text-[#6A7573]">
                        <div className="flex items-center">
                          <span className="mr-3">You pay:</span>
                          <Avatar className="h-10 w-10 border-4 border-[#6A7573] bg-[#C5E4B4] text-[#6A7573] shadow-lg">
                            <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                        </div>
                        <span>$37.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          ref={ref1}
          initial="hidden"
          animate={isInView1 ? "visible" : "hidden"}
          variants={popInVariants}
          id="features"
          className="bg-[#F0F9E8] px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#6A7573] sm:text-4xl md:mb-16 md:text-5xl">
              Why Choose ShareFare?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
              {[
                { icon: DollarSign, title: "Fair Splitting", description: "Automatically divide bills based on what each person ordered, ensuring everyone pays their fair share." },
                { icon: Users, title: "Group Friendly", description: "Easily manage bills for groups of any size, from intimate dinners to large gatherings." },
                { icon: Zap, title: "Instant Calculations", description: "Get real-time updates as items are added or removed, with tax and tip automatically factored in." }
              ].map((feature, index) => (
                <Card key={index} className="border-[#C5E4B4] bg-white transition-shadow duration-200 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <feature.icon className="mb-6 h-16 w-16 text-[#4A5554]" />
                    <h3 className="mb-4 text-2xl font-semibold text-[#6A7573]">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-[#6A7573]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section 
          ref={ref2}
          initial="hidden"
          animate={isInView2 ? "visible" : "hidden"}
          variants={popInVariants}
          id="how-it-works" 
          className="px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#6A7573] sm:text-4xl md:mb-16 md:text-5xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: ScanLine, title: "Scan a Bill", description: "Quickly create a session by scanning your restaurant bill." },
                { icon: UserPlus, title: "Invite Friends", description: "Easily add your dining companions to the bill-splitting session." },
                { icon: Wallet, title: "Split and Pay", description: "Divide the bill fairly and settle up with your preferred payment method." }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DBFBC9] text-3xl font-bold text-[#6A7573]">
                    <step.icon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold text-[#6A7573]">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#6A7573]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={ref3}
          initial="hidden"
          animate={isInView3 ? "visible" : "hidden"}
          variants={popInVariants}
          id="signup"
          className="bg-[#F0F9E8] px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-[#6A7573] sm:text-4xl md:text-5xl">
              Ready to Simplify Your Bill Splitting?
            </h2>
            <p className="mb-10 text-xl text-[#6A7573]">
              Join thousands of satisfied users who have made dining out with
              friends stress-free.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full max-w-xs rounded-lg border-[#C5E4B4] bg-white px-4 py-6 text-lg text-[#6A7573] focus:border-[#4A5554] focus:ring-[#4A5554]"
              />
              <Button className="w-full rounded-lg bg-[#DBFBC9] px-8 py-6 text-lg text-[#6A7573] transition-colors duration-200 hover:bg-[#C5E4B4] sm:w-auto">
                Sign Up for Free
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.footer 
        ref={ref4}
        initial="hidden"
        animate={isInView4 ? "visible" : "hidden"}
        variants={popInVariants}
        className="bg-white px-4 py-12 md:px-6"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between md:flex-row">
          <div className="mb-6 text-2xl font-bold text-[#6A7573] md:mb-0">
            ShareFare
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center space-x-8">
              <li>
                <Link
                  href="#"
                  className="text-[#6A7573] transition-colors duration-200 hover:text-[#4A5554]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6A7573] transition-colors duration-200 hover:text-[#4A5554]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6A7573] transition-colors duration-200 hover:text-[#4A5554]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </motion.footer>
    </div>
  );
}