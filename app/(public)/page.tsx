import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { PaimaHomeClientWrapper } from "@/components/home/PaimaHomeClientWrapper";

export const metadata: Metadata = constructMetadata({
  title: "Paima | Luxury Interior Design, Architecture & Prime Real Estate",
  description:
    "Paima is a haute interior architecture and luxury interior design studio orchestrating bespoke residential interiors, private estates, and luxury penthouses in Kolkata, India, and premier global locations.",
  path: "/",
  keywords: [
    "Luxury Interior Design",
    "Interior Designer Kolkata",
    "Luxury Interior Design Kolkata",
    "Interior Design Services India",
    "Residential Interior Architecture",
  ],
});

export default function HomePage() {
  return <PaimaHomeClientWrapper />;
}
