import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BentoGridServices } from "@/components/ui/BentoGridServices";
import { TextSlideFromTop, Element3DReveal } from "@/components/animations/MotionDirectional";

export const metadata: Metadata = constructMetadata({
  title: "Haute Interior Architecture & Real Estate Advisory | Paima",
  description:
    "Explore our multidisciplinary offerings: Haute Residential Architecture, Prime Real Estate Acquisitions, 3D Spatial CGI Digital Twins, and Art Curation.",
  path: "/services",
});

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Spatial Discovery",
    desc: "Comprehensive programmatic analysis, site immersion, natural light mapping, and lifestyle choreography.",
  },
  {
    step: "02",
    title: "Concept Synthesis",
    desc: "Material palette curation, sketch models, spatial flow diagrams, and architectural mood collages.",
  },
  {
    step: "03",
    title: "3D Digital Twins",
    desc: "Sub-millimeter CGI walkthroughs and photorealistic lighting studies to validate every stone cut and joint.",
  },
  {
    step: "04",
    title: "Artisan Fabrication",
    desc: "Direct procurement from Italian stone quarries, Parisian bronze foundries, and Japanese joinery masters.",
  },
  {
    step: "05",
    title: "Turnkey Curation",
    desc: "White-glove styling, commissioned artwork installation, and final ceremonial handover of your private sanctuary.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-black bg-[#E1D4C2]">
      {/* HEADER */}
      <section aria-label="Services Introduction" className="mb-20">
        <TextSlideFromTop>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-black" />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
              MULTIDISCIPLINARY OFFERINGS
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.1] max-w-4xl">
            Tailored Disciplines for <br />
            <span className="italic text-black">Extraordinary Spaces.</span>
          </h1>

          <p className="mt-6 font-sans text-sm sm:text-base text-black max-w-2xl font-semibold leading-relaxed">
            From monumental private penthouses to intimate villa sanctuaries, we orchestrate every stage of the spatial journey with artistic integrity and technical precision.
          </p>
        </TextSlideFromTop>
      </section>

      {/* BENTO GRID */}
      <section aria-label="Interactive Disciplines Grid" className="mb-28 lg:mb-40">
        <BentoGridServices />
      </section>

      {/* PROCESS */}
      <section aria-label="Methodology & Process" className="mb-28 lg:mb-40">
        <SectionHeading
          eyebrow="THE PAIMA METHOD"
          title="The Five Phases of Creation"
          subtitle="A structured, meticulous journey transforming conceptual intention into architectural reality."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
          {PROCESS_STEPS.map((item, idx) => (
            <Element3DReveal key={item.step} delay={0.1 * idx}>
              <div className="p-6 bg-[#BEB5A9]/60 border border-[#A78D78]/50 rounded-2xl h-full flex flex-col justify-between hover:border-black transition-colors duration-400 shadow-xl">
                <div>
                  <span className="font-serif text-3xl text-black font-black block mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-lg text-black mb-2 font-bold">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-black leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#A78D78]/50">
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-black font-extrabold">
                    Phase {idx + 1} of 5
                  </span>
                </div>
              </div>
            </Element3DReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-8">
        <TextSlideFromTop>
          <div className="bg-[#BEB5A9] text-black p-12 sm:p-20 border border-[#A78D78] max-w-4xl mx-auto space-y-6 rounded-2xl shadow-2xl">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
              DIRECT ENGAGEMENT
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-black">
              Commission Your Architectural Vision
            </h2>
            <p className="font-sans text-xs sm:text-sm text-black max-w-lg mx-auto font-bold leading-relaxed">
              We welcome private consultations to evaluate the feasibility, timeline, and artistic scope of your upcoming project.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E1D4C2] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black"
              >
                <span>REQUEST COMMISSION CONSULTATION &rarr;</span>
              </Link>
            </div>
          </div>
        </TextSlideFromTop>
      </section>
    </div>
  );
}
