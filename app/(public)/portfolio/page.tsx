import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { PaimaDesignDiscovery } from "@/components/portfolio/PaimaDesignDiscovery";

export const metadata: Metadata = constructMetadata({
  title: "Interactive Design Studio & Spatial Discovery | Paima",
  description:
    "Explore PAIMA's interactive interior design discovery studio. Select room typologies and curated material palettes to discover 20+ luxury interior concepts.",
  path: "/portfolio",
  keywords: [
    "PAIMA Design Studio",
    "Interactive Interior Design Discovery",
    "Luxury Interior Design Concepts",
    "Material Palette Curation",
    "Spatial Architecture Monograph",
  ],
});

export default function PortfolioPage() {
  return <PaimaDesignDiscovery />;
}
