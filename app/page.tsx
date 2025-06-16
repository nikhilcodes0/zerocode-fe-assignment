"use client";

import Image from "next/image";
import union from "@/public/Union.png";
import heroLogo from "@/public/hero-logo.png";
import Link from "next/link";

export default function App() {
  return (
    <>
      <div className="relative h-[560px] w-screen dark:[background:linear-gradient(180deg,rgba(40,40,40,1)_0%,rgba(30,50,60,1)_50%,rgba(20,30,40,0)_100%)] [background:linear-gradient(180deg,rgba(255,240,200,1)_0%,rgba(200,255,242,1)_50%,rgba(200,222,255,0)_100%)]">
        <Image
          src={union}
          alt="union"
          width={300}
          height={300}
          priority
          style={{ objectFit: "contain" }}
          className="w-full h-fit absolute top-0 left-0 animate-fade-in-up dark:invert"
        />
        <Image
          src={heroLogo}
          alt="hero-logo"
          width={500}
          height={100}
          priority
          style={{ objectFit: "contain" }}
          className="w-[400px] mx-auto h-fit relative top-[13rem] left-0 animate-fade-in-up animate-delay-200"
        />
      </div>
      <h1 className="text-center text-3xl font-semibold mt-12 font-poppins animate-fade-in-up animate-delay-400">
        The Most Trusted And Fast Chatbot Ever
      </h1>
      <p className="text-center text-lg p-4 px-7 opacity-70 font-poppins animate-fade-in-up animate-delay-400">
        ZeroCode is the most trusted and fast chatbot ever made on internet.
      </p>
      <div className="flex flex-row gap-8 justify-center items-center mt-9 w-full px-4 animate-fade-in-up animate-delay-600">
        <div className="flex justify-center items-center w-full">
          <Link
            href="/register"
            className="cursor-pointer bg-black dark:bg-white text-white dark:text-black py-4 w-full rounded-xl font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-center"
          >
            Get Started
          </Link>
        </div>
        <div className="flex justify-center items-center w-full">
          <Link
            href="/signin"
            className="cursor-pointer border-black dark:border-white border-2 text-black dark:text-white py-4 w-full rounded-xl font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-center"
          >
            SignIn
          </Link>
        </div>
      </div>
    </>
  );
}
