"use client";

import Link from "next/link";
import {
  FaGoogle,
  FaGithub,
  FaApple,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-[#2E3440] overflow-hidden">
        
      </div>

      <div className="flex flex-row absolute gap-5 top-23 left-4">
        <p className="text-[8rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-[#D8DEE9]">
          SIGN
        </p>
        <p className="text-[8rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-transparent [-webkit-text-stroke:0.5px_#D8DEE9]">
          IN
        </p>
      </div>
      <div className="p-8 bg-[#4C566A] w-[95%] mx-auto rounded-xl mt-54 animate-fade-in-up animate-delay-400 shadow-[0_0_17px_rgba(0,0,0,1)] relative z-10">
        <div className="">
          <h1 className="text-3xl font-semibold font-poppins text-[#ECEFF4]">
            Welcome Back to ZeroCode
          </h1>
          <p className="text-sm opacity-70 mt-2 font-poppins text-[#E5E9F0]">
            If you don't have an account registered, <br /> You can{" "}
            <Link
              href="/register"
              className="text-[#a8dbe9] font-semibold hover:text-[#8FBCBB] transition-colors"
            >
              Register here !
            </Link>
          </p>
        </div>
        <div className="mt-12">
          <form>
            <div className="flex flex-col gap-4">
              
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] focus:outline-none focus:border-[#88C0D0] transition-colors w-full"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] w-full focus:outline-none focus:border-[#88C0D0] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8DEE9] hover:text-[#E5E9F0] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="p-4 rounded-xl bg-[#5E81AC] text-[#ECEFF4] font-semibold hover:bg-[#81A1C1] transition-colors"
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-sm opacity-70 my-5 font-poppins text-center text-[#E5E9F0]">
            or continue with
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <button className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors">
              <FaGoogle className="text-[#BF616A]" /> Google
            </button>
            <button className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors">
              <FaGithub className="text-[#D8DEE9]" /> Github
            </button>
            <button className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors">
              <FaApple className="text-[#D8DEE9]" /> Apple
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
