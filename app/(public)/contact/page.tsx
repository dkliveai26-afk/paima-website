import type { Metadata } from "next";
import { constructMetadata, generateFAQSchema } from "@/lib/seo";
import { AGENCY_INFO } from "@/lib/data";
import { ContactForm } from "@/components/ui/ContactForm";
import { SlideFromLeft, SlideFromRight, FadeUpBottom, SlowCardReveal } from "@/components/animations/MotionDirectional";

export const metadata: Metadata = constructMetadata({
  title: "Private Inquiries & Studio Concierge | Paima Luxury Interiors",
  description:
    "Initiate a confidential interior design consultation with Paima. Book private residential architecture and luxury interior design inquiries in Kolkata, India, and globally.",
  path: "/contact",
  keywords: [
    "Contact Paima Interior Design",
    "Luxury Interior Design Consultation Kolkata",
    "Interior Designer Contact India",
    "Private Architectural Inquiries",
    "Residential Interior Architecture Dossier",
  ],
});

const PAIMA_FAQS = [
  {
    question: "What interior design services does PAIMA offer?",
    answer:
      "PAIMA provides haute residential interior architecture, luxury interior design, prime real estate acquisition advisory, 3D spatial CGI digital twin walkthroughs, and bespoke furniture & art curation across Kolkata, India, and premier international destinations.",
  },
  {
    question: "How do I initiate a project consultation with PAIMA?",
    answer:
      "You can initiate a private consultation by completing our confidential dossier form on this page or contacting our concierge at concierge@paimadesign.com. A senior partner will review your spatial requirements and contact you within 24 business hours.",
  },
  {
    question: "What property typologies does PAIMA specialize in?",
    answer:
      "PAIMA specializes in high-end private residences, luxury apartments, sky penthouses, sprawling villas, and historic architectural restorations, prioritizing subtractive luxury, spatial volume, and natural material authenticity.",
  },
  {
    question: "Where does PAIMA execute interior design & architectural projects?",
    answer:
      "PAIMA executes private residential commissions in Kolkata, across West Bengal & India, as well as international projects across New York, Paris, Monaco, and Los Angeles.",
  },
];

export default function ContactPage() {
  const faqSchema = generateFAQSchema(PAIMA_FAQS);

  return (
    <div className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-black bg-[#E1D4C2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-10">
          <SlideFromLeft>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="w-8 h-[2px] bg-black" />
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
                CLIENT CONCIERGE
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.1] break-words">
              Begin A <br />
              <span className="italic text-black">Private Dialogue.</span>
            </h1>

            <p className="mt-4 sm:mt-6 font-sans text-xs sm:text-sm text-black font-semibold leading-relaxed">
              Every commission begins with an open conversation regarding spatial ambition, materiality, and emotional resonance. We welcome private residential inquiries in Kolkata, India, and worldwide.
            </p>
          </SlideFromLeft>

          <SlideFromLeft delay={0.15}>
            <div className="space-y-5 sm:space-y-6 pt-5 sm:pt-6 border-t border-[#A78D78]/50">
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-black font-extrabold">
                  Direct Inquiries
                </span>
                <p className="font-serif text-lg sm:text-2xl text-black font-black">
                  <a
                    href={`mailto:${AGENCY_INFO.email}`}
                    className="hover:text-[#A78D78] transition-colors duration-300 break-all"
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
                  Monday &ndash; Friday &bull; 09:00 &ndash; 18:00 EST / IST
                </p>
              </div>
            </div>
          </SlideFromLeft>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <SlideFromRight delay={0.2}>
            <ContactForm />
          </SlideFromRight>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section aria-label="Frequently Asked Questions" className="mt-16 sm:mt-28 pt-10 sm:pt-16 border-t border-[#A78D78]/50">
        <FadeUpBottom>
          <div className="mb-8 sm:mb-12">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold block mb-2">
              HELPFUL INFORMATION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-black tracking-tight break-words">
              Frequently Asked Questions
            </h2>
          </div>
        </FadeUpBottom>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PAIMA_FAQS.map((faq, idx) => (
            <SlowCardReveal key={idx} delay={0.14 * idx}>
              <div className="bg-[#BEB5A9]/50 p-5 sm:p-8 rounded-2xl border border-[#A78D78]/50 space-y-2.5 sm:space-y-3 shadow-lg">
                <h3 className="font-serif text-base sm:text-lg text-black font-extrabold">
                  {faq.question}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-black/80 font-bold leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </SlowCardReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
