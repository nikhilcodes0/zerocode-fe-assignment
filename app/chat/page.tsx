import logo from "@/public/logo.png";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa";

export default function Chat() {
  return (
    <>
      <div className="flex flex-col items-center  h-screen gap-4 bg-[#2E3440] p-8 rounded-xl shadow-[0_0_17px_rgba(0,0,0,1)] relative ">
        <div className="flex flex-col items-center justify-center gap-2 pt-32 animate-fade-in-up animate-delay-400">
          <Image
            src={logo}
            alt="logo"
            width={40}
            height={40}
            className="invert"
          />
          <h1 className="text-xl font-bold text-[#ECEFF4]">
            Ask ZeroCode anything!
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-full absolute bottom-10 px-8 animate-fade-in-up animate-delay-400">
          <div className="text-start w-full relative bottom-10">
            <p className="text-sm text-[#ECEFF4] font-semibold">
              Suggestions, questions, or just say hi!
            </p>
            <div className="flex flex-row items-center gap-2 w-full mt-5">
              <div className="text-[13px] border border-dotted bg-[#3b42519f] border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#D8DEE9] hover:bg-[#3B4252] cursor-pointer transition-colors">
                Hi!
              </div>
              <div className="text-[13px] border border-dotted bg-[#3b42519f] border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#D8DEE9] hover:bg-[#3B4252] cursor-pointer transition-colors">
                How can I get started?
              </div>
              <div className="text-[13px] border border-dotted bg-[#3b42519f] border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#D8DEE9] hover:bg-[#3B4252] cursor-pointer transition-colors">
                What can you do?
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full">
            <input
              type="text"
              placeholder="Ask ZeroCode anything"
              className="w-full max-w-md p-2 rounded-md border border-gray-300 outline-none bg-[#3B4252]"
            />
            <button className="bg-[#5E81AC] text-[#ECEFF4] p-5 rounded-md h-10 flex items-center justify-center hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
