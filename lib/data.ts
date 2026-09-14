export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Minimalist" | "Modern" | "Vintage" | "Penthouse";
  location: string;
  year: string;
  area: string;
  price?: string;
  image: string;
  featured: boolean;
  description: string;
  materials: string[];
  architect: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  details: string[];
  tag: string;
  span: string;
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  client: string;
  title: string;
  location: string;
  project: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  milestone: string;
}

export const AGENCY_INFO = {
  name: "PAIMA",
  legalName: "Paima Luxury Interiors & Prime Real Estate Group",
  tagline: "Ultra-Prime Real Estate & Bespoke Spatial Architecture",
  description:
    "Paima is an elite interior design and prime luxury real estate agency curating monumental residential estates, private waterfront villas, and bespoke sky penthouses across Monaco, Beverly Hills, Paris, and New York.",
  founder: "Alexandre Paima & Elena Vance",
  email: "concierge@paimadesign.com",
  phone: "+1 (212) 890-4100",
  address: "575 Madison Avenue, Upper East Side, New York, NY 10022",
  offices: [
    { city: "New York", address: "575 Madison Ave, Manhattan", phone: "+1 (212) 890-4100" },
    { city: "Monaco", address: "Avenue Princesse Grace, Monte Carlo", phone: "+377 97 97 10 00" },
    { city: "Paris", address: "32 Rue du Faubourg Saint-Honoré", phone: "+33 1 40 17 00 50" },
    { city: "Los Angeles", address: "9601 Wilshire Blvd, Beverly Hills", phone: "+1 (310) 550-2000" },
  ],
  stats: [
    { label: "Prime Estates Managed", value: "₹1.8B+" },
    { label: "Turnkey Residences", value: "140+" },
    { label: "Global Design Laurels", value: "32" },
    { label: "Years of Distinction", value: "15" },
  ],
  socials: [
    { name: "Instagram", href: "https://instagram.com", handle: "@paimarealestate" },
    { name: "Architectural Digest", href: "https://architecturaldigest.com", handle: "Paima Monograph" },
    { name: "LinkedIn", href: "https://linkedin.com", handle: "Paima Group" },
    { name: "YouTube", href: "https://youtube.com", handle: "Paima Estates" },
  ],
};

export const HERO_ESTATE = {
  title: "Villa Bel-Air Horizon",
  location: "Bel-Air, Los Angeles",
  specs: "14,500 sq.ft • 6 Beds • 8 Baths • Infinity Pool",
  price: "₹2,85,00,000",
  image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80",
  interiorSpecs: [
    "Honed Roman Travertine Decking",
    "Sub-Zero & Gaggenau Custom Chef Kitchen",
    "Cantilevered Infinity Edge Lap Pool",
    "Custom Fluted Oak Woodwork & Smart Glass",
  ],
};

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "bel-air-horizon-estate",
    title: "Villa Bel-Air Horizon",
    category: "Modern",
    location: "Bel-Air, Los Angeles",
    year: "2025",
    area: "14,500 sq.ft",
    price: "₹2,85,00,000",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80",
    featured: true,
    description:
      "A monumental architectural villa with floor-to-ceiling glass apertures, an expansive cantilevered infinity pool, and seamless indoor-outdoor Italian travertine terraces overlooking city lights.",
    materials: ["Roman Travertine", "Smoked Belgian Oak", "Blackened Steel", "Solar Thermal Glass"],
    architect: "Alexandre Paima",
  },
  {
    id: "proj-2",
    slug: "cote-dazur-waterfront-villa",
    title: "Villa Solstice Cap d'Antibes",
    category: "Modern",
    location: "French Riviera, France",
    year: "2024",
    area: "12,200 sq.ft",
    price: "₹3,40,00,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
    featured: true,
    description:
      "Sculptural Mediterranean luxury with private sea access, submerged pool bar, monolithic Calacatta marble interiors, and lush subtropical palms.",
    materials: ["Calacatta Borghini", "Bespoke Bronze Metalwork", "Bleached Teak", "Linen Drapery"],
    architect: "Elena Vance",
  },
  {
    id: "proj-3",
    slug: "tribeca-monolith-penthouse",
    title: "The Tribeca Monolith Penthouse",
    category: "Penthouse",
    location: "Tribeca, New York",
    year: "2025",
    area: "8,400 sq.ft",
    price: "₹2,20,00,000",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80",
    featured: true,
    description:
      "A subterranean sky sanctuary sculpted from honed Roman travertine, oiled European oak, and fluted shadow lines, yielding seamless spatial fluidity above Manhattan.",
    materials: ["Roman Travertine", "Smoked Belgian Oak", "Patinated Bronze", "Raw Cashmere"],
    architect: "Alexandre Paima",
  },
  {
    id: "proj-4",
    slug: "paris-hotel-particulier",
    title: "Hôtel Particulier Saint-Germain",
    category: "Vintage",
    location: "6th Arr., Paris",
    year: "2024",
    area: "6,900 sq.ft",
    price: "₹1,85,00,000",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    featured: false,
    description:
      "Restoration of an 18th-century Haussmannian salon infused with avant-garde French collectible design, restored boiserie, and tactile bouclé upholstery.",
    materials: ["Restored Boiserie", "Breccia Capraia Marble", "Antiqued Mirror", "Calacatta Gold"],
    architect: "Elena Vance",
  },
  {
    id: "proj-5",
    slug: "ginza-minimalist-duplex",
    title: "Ginza Sky Pavilion",
    category: "Minimalist",
    location: "Ginza, Tokyo",
    year: "2024",
    area: "5,300 sq.ft",
    price: "₹1,48,00,000",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80",
    featured: false,
    description:
      "A serene Zen-modernist duplex framed by hinoki cypress screens, unlacquered steel partitions, and indirect concealed wash lighting.",
    materials: ["Hinoki Cypress", "Washi Paper Panels", "Blackened Steel", "Honed Basalt"],
    architect: "Alexandre Paima",
  },
  {
    id: "proj-6",
    slug: "lake-como-palazzo",
    title: "Palazzo Bellagio Waterfront",
    category: "Modern",
    location: "Lake Como, Italy",
    year: "2024",
    area: "11,200 sq.ft",
    price: "₹2,60,00,000",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80",
    featured: false,
    description:
      "A sublime juxtaposition of classic Lombardian limestone architecture with razor-sharp contemporary glass apertures framing alpine waters.",
    materials: ["Verde Alpi Marble", "Lombardy Limestone", "Hand-brushed Brass", "Silk Wool"],
    architect: "Elena Vance",
  },
];

export const SERVICES: Service[] = [
  {
    id: "service-residential",
    title: "Prime Real Estate & Architecture",
    shortDescription:
      "Off-market acquisition, architectural planning, and turnkey construction of ultra-luxury estates and private waterfront residences.",
    tag: "Real Estate & Build",
    span: "col-span-12 lg:col-span-7",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    details: [
      "Confidential off-market real estate sourcing across premier global cities",
      "Full structural interior architecture & spatial transformation",
      "Custom Italian millwork, marble slab selection & structural engineering",
      "Comprehensive white-glove site delivery from foundation to styling",
    ],
  },
  {
    id: "service-hospitality",
    title: "Haute Interior Architecture",
    shortDescription:
      "Tailored luxury interior design, bespoke millwork, curated stone finishes, and museum-grade lighting choreography.",
    tag: "Interior Design",
    span: "col-span-12 lg:col-span-5",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    details: [
      "Custom spatial choreography balancing vastness with intimate repose",
      "Tactile material specifications: rare travertine, patinated bronze, raw bouclé",
      "Smart circadian and architectural accent lighting scenarios",
      "Acoustically tuned sanctuaries and climate-controlled art display niches",
    ],
  },
  {
    id: "service-rendering",
    title: "3D Spatial CGI & Digital Twins",
    shortDescription:
      "Photorealistic 3D visualization, virtual reality architectural walkthroughs, and daytime-to-evening circadian lighting simulations.",
    tag: "CGI Visualization",
    span: "col-span-12 lg:col-span-5",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    details: [
      "Millimeter-accurate photorealistic lighting and stone grain shader mapping",
      "Interactive 360-degree digital twin walkthroughs for international buyers",
      "Circadian sunlight and seasonal shadow analysis",
      "Pre-construction material selection verification",
    ],
  },
  {
    id: "service-curation",
    title: "Bespoke Furnishing & Art Advisory",
    shortDescription:
      "Acquiring rare collectible 20th-century design pieces, commissioning bespoke master furniture, and fine art curatorial consulting.",
    tag: "Art & Furnishing",
    span: "col-span-12 lg:col-span-7",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    details: [
      "International gallery sourcing of blue-chip collectible design (Milan, Paris, Basel)",
      "Bespoke furniture commissions manufactured by historic European ateliers",
      "Curatorial advisory for contemporary private art collections",
      "Textile couture: hand-knotted cashmere rugs and French custom linens",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote:
      "Paima orchestrated both the private acquisition and complete architectural reimagining of our Bel-Air estate. The transition between the cantilevered pool and the travertine living salon is breathtaking.",
    client: "Marcus & Genevieve Sterling",
    title: "Private Investors",
    location: "Bel-Air, California",
    project: "Villa Bel-Air Horizon",
  },
  {
    id: "test-2",
    quote:
      "Their architectural precision and discrete representation are without peer in prime real estate. The French Riviera villa they designed for us has set a new benchmark on Cap d'Antibes.",
    client: "Baroness Sophie de Courcel",
    title: "Art Patron",
    location: "Antibes & Monaco",
    project: "Villa Solstice Cap d'Antibes",
  },
  {
    id: "test-3",
    quote:
      "The rarest quality in high-end design is understanding restraint. Paima transformed our Tribeca penthouse into a peaceful sanctuary suspended above the city.",
    client: "Daisuke & Mia Takahashi",
    title: "Tech Founders",
    location: "New York & Tokyo",
    project: "The Tribeca Monolith Penthouse",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    year: "2011",
    title: "Genesis of Paima Group",
    description:
      "Founded in Paris and Monaco by Alexandre Paima to fuse high-conviction luxury real estate representation with bespoke architectural design.",
    milestone: "Studio Founded",
  },
  {
    year: "2016",
    title: "Expansion to New York Upper East Side",
    description:
      "Inaugurated the Madison Avenue studio, executing monumental Manhattan penthouses and expansive Hamptons waterfront compounds.",
    milestone: "US Flagship",
  },
  {
    year: "2021",
    title: "Beverly Hills & Western Coast Presence",
    description:
      "Established our Wilshire Boulevard presence, pioneering modern canyon estates with infinity edge pools and indoor-outdoor pavilions.",
    milestone: "West Coast Studio",
  },
  {
    year: "2026",
    title: "The ₹1.8B Prime Portfolio Milestone",
    description:
      "Surpassed ₹1.8B in orchestrated ultra-prime transactions and architectural renovations across premier global capitals.",
    milestone: "Global Leader",
  },
];
