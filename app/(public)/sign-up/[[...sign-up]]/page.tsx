import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Create Patron Account | Paima",
  description:
    "Register for confidential access to unlisted architectural acquisitions and bespoke interior commissions.",
  path: "/sign-up",
});

export default function SignUpPage() {
  return (
    <div className="min-h-screen pt-36 pb-24 px-6 flex flex-col items-center justify-center bg-[#E1D4C2] text-black">
      <div className="mb-8 text-center max-w-md space-y-2">
        <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
          NEW PATRON REGISTRATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-black font-bold">
          Create Your Patron Account
        </h1>
      </div>
      <SignUp />
    </div>
  );
}
