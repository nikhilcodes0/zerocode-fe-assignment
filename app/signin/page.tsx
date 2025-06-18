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

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) throw signInError;

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

      <div className="flex flex-row absolute gap-5 left-1/2 top-14 md:top-0 lg:-top-5 xl:-top-15 -translate-x-1/2">
        <p className="text-[6rem] sm:text-[8rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-[#D8DEE9] md:text-[11rem] lg:text-[14rem] xl:text-[18rem]">
          SIGN
        </p>
        <p className="text-[6rem] sm:text-[8rem] font-bold font-poppins animate-fade-in-up animate-delay-400 text-transparent [-webkit-text-stroke:2px_#D8DEE9]  md:text-[11rem] lg:text-[14rem] xl:text-[18rem]">
          IN
        </p>
      </div>
      <div className="p-8 bg-[#4C566A] w-[90%] sm:w-[95%] 2xl:w-[60%] mx-auto rounded-xl mt-[150px] sm:mt-42 animate-fade-in-up animate-delay-400 shadow-[0_0_17px_rgba(0,0,0,1)] relative z-10 lg:w-[75%] xl:mt-48">
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
          {error && (
            <div className="mb-4 p-4 rounded-md bg-[#BF616A] text-[#ECEFF4] text-sm">
              {error}
            </div>
          )}
          <form>
            <div className="flex flex-col gap-4">
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
              <button
                type="submit"
                className="p-4 rounded-xl bg-[#5E81AC] text-[#ECEFF4] font-semibold hover:bg-[#81A1C1] transition-colors"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          <p className="text-sm opacity-70 my-5 font-poppins text-center text-[#E5E9F0]">
            or continue with
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <button
              onClick={() => handleSocialLogin("google")}
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
            >
              <FaGoogle className="text-[#BF616A]" /> Google
            </button>
            <button
              onClick={() => handleSocialLogin("github")}
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
            >
              <FaGithub className="text-[#D8DEE9]" /> Github
            </button>
            <button
              onClick={() => handleSocialLogin("apple")}
              className="p-4 rounded-xl bg-[#2E3440] text-[#D8DEE9] font-semibold flex items-center gap-2 hover:bg-[#3B4252] transition-colors"
            >
              <FaApple className="text-[#D8DEE9]" /> Apple
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
