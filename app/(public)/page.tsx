import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { PaimaHomeClientWrapper } from "@/components/home/PaimaHomeClientWrapper";

export const metadata: Metadata = constructMetadata({
  title: "Paima | Luxury Interior Design & Prime Real Estate",
  description:
    "Paima is an elite interior architecture and prime real estate agency curating monumental residences, modern villas with pools, and private sky penthouses across Los Angeles, New York, Monaco, and Paris.",
  path: "/",
});

export default function HomePage() {
  return <PaimaHomeClientWrapper />;
}
