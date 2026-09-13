import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { AGENCY_INFO } from "@/lib/data";
import { ContactForm } from "@/components/ui/ContactForm";
import { TextSlideFromTop, Element3DReveal } from "@/components/animations/MotionDirectional";

export const metadata: Metadata = constructMetadata({
  title: "Private Inquiries & Concierge | Paima",
  description:
    "Initiate a confidential architectural consultation with the partners at Paima. Studios in Manhattan, Paris, Monaco, and Los Angeles.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-black bg-[#E1D4C2]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-10">
          <TextSlideFromTop>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-black" />
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
                CLIENT CONCIERGE
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.1]">
              Begin A <br />
              <span className="italic text-black">Private Dialogue.</span>
            </h1>

            <p className="mt-6 font-sans text-sm text-black font-semibold leading-relaxed">
              Every commission begins with an open conversation regarding spatial ambition, materiality, and emotional resonance. We welcome private residential inquiries worldwide.
            </p>
          </TextSlideFromTop>

          <TextSlideFromTop delay={0.2}>
            <div className="space-y-6 pt-6 border-t border-[#A78D78]/50">
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-black font-extrabold">
                  Direct Inquiries
                </span>
                <p className="font-serif text-xl sm:text-2xl text-black font-black">
                  <a
                    href={`mailto:${AGENCY_INFO.email}`}
                    className="hover:text-[#A78D78] transition-colors duration-300"
                  >
                    {AGENCY_INFO.email}
                  </a>
                </p>
                <p className="font-mono text-xs text-black pt-1 font-extrabold">
                  {AGENCY_INFO.phone}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-black font-extrabold">
                  Operating Hours
                </span>
                <p className="text-xs text-black font-bold">
                  Monday &ndash; Friday &bull; 09:00 &ndash; 18:00 EST / CET
                </p>
              </div>
            </div>
          </TextSlideFromTop>


        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <Element3DReveal delay={0.2}>
            <ContactForm />
          </Element3DReveal>
        </div>
      </div>
    </div>
  );
}
