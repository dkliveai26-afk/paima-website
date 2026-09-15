import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Patron Portal Sign In | Paima",
  description:
    "Access your private Paima client dossier, project updates, and off-market portfolio.",
  path: "/sign-in",
});

export default function SignInPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 flex flex-col items-center justify-center bg-[#E1D4C2] text-black">
      <div className="mb-8 text-center max-w-md space-y-2">
        <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
          PATRON PORTAL ACCESS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-black font-bold">
          Sign In to Your Account
        </h1>
      </div>
      <SignIn />
    </div>
  );
}
