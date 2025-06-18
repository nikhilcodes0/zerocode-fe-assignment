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
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError(
            "This email is already registered. Please login or use a different email."
          );
        } else {
          throw signUpError;
        }
        setLoading(false);
        return;
      }

      // If signup successful, redirect to chat
      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#2E3440] overflow-hidden"></div>

      <div className="flex flex-row absolute gap-5 top-14 md:top-0 lg:-top-5 xl:-top-15 left-1/2 -translate-x-1/2">
        <p className="text-[6rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[18rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-[#D8DEE9]">
          SIGN
        </p>
        <p className="text-[6rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[18rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-transparent [-webkit-text-stroke:2px_#D8DEE9]">
          UP
        </p>
      </div>
      <div className="p-8 bg-[#4C566A] w-[90%] sm:w-[95%] 2xl:w-[60%] mx-auto rounded-xl mt-[150px] sm:mt-42 animate-fade-in-up animate-delay-400 shadow-[0_0_17px_rgba(0,0,0,1)] relative z-10 lg:w-[75%] xl:mt-48">
        <div className="">
          <h1 className="text-3xl font-semibold font-poppins text-[#ECEFF4]">
            Welcome to ZeroCode
          </h1>
          <p className="text-sm opacity-70 mt-2 font-poppins text-[#E5E9F0]">
            If you already have an account, <br /> You can{" "}
            <Link
              href="/signin"
              className="text-[#88C0D0] font-semibold hover:text-[#8FBCBB] transition-colors"
            >
              Login here !
            </Link>
          </p>
        </div>
        <div className="mt-12">
          {error && (
            <div className="mb-4 p-4 rounded-md bg-[#BF616A] text-[#ECEFF4] text-sm">
              {error}
            </div>
          )}
          <form>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type="text"
                  placeholder="Name"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] focus:outline-none focus:border-[#88C0D0] transition-colors w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] focus:outline-none focus:border-[#88C0D0] transition-colors w-full"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] w-full focus:outline-none focus:border-[#88C0D0] transition-colors"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8DEE9] hover:text-[#E5E9F0] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#88C0D0]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="p-4 pl-12 rounded-xl border border-[#3B4252] bg-[#2E3440] text-[#D8DEE9] placeholder-[#4C566A] w-full focus:outline-none focus:border-[#88C0D0] transition-colors"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8DEE9] hover:text-[#E5E9F0] transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="p-4 rounded-xl bg-[#5E81AC] text-[#ECEFF4] font-semibold hover:bg-[#81A1C1] transition-colors"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
          <p className="text-sm opacity-70 my-5 font-poppins text-center text-[#E5E9F0]">
            or continue with
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <button
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
              onClick={() => handleSocialLogin("google")}
            >
              <FaGoogle className="text-[#BF616A]" /> Google
            </button>
            <button
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
              onClick={() => handleSocialLogin("github")}
            >
              <FaGithub className="text-[#D8DEE9]" /> Github
            </button>
            <button
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
              onClick={() => handleSocialLogin("apple")}
            >
              <FaApple className="text-[#D8DEE9]" /> Apple
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
