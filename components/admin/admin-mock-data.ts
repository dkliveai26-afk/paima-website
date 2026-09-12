export type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type ServiceType =
  | "Haute Architectural Interior"
  | "Private Residence Renovation"
  | "Luxury Penthouse Staging"
  | "Bespoke Estate Advisory"
  | "Prime Commercial & Hospitality";

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAvatar?: string;
  service: ServiceType;
  propertyType: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  budget: string;
  squareFootage?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  message: string;
  notes?: string[];
  isVip?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  totalBookings: number;
  totalBudget: string;
  latestBookingDate: string;
  latestService: ServiceType;
  status: "VIP Client" | "Active Client" | "New Lead" | "Archived";
  joinedDate: string;
  notesCount: number;
}

export interface InquiryMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAvatar: string;
  subject: string;
  snippet: string;
  fullMessage: string;
  service: ServiceType;
  timestamp: string;
  isUnread: boolean;
  isStarred: boolean;
  replies?: Array<{
    sender: string;
    text: string;
    timestamp: string;
    isAdmin: boolean;
  }>;
}

export interface CalendarBookingEvent {
  id: string;
  bookingId: string;
  title: string;
  clientName: string;
  service: ServiceType;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  status: BookingStatus;
  location: string;
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-8901",
    clientName: "Eleanor Vance-Roche",
    clientEmail: "eleanor.roche@vancegroup.ch",
    clientPhone: "+41 22 819 9021",
    service: "Haute Architectural Interior",
    propertyType: "Historic Haussmannian Triplex",
    location: "Avenue Montaigne, 8th Arr., Paris",
    preferredDate: "2026-09-24",
    preferredTime: "14:30 CET",
    budget: "$450,000 – $600,000",
    squareFootage: "4,800 sq ft",
    status: "NEW",
    createdAt: "2026-09-12 11:20",
    updatedAt: "2026-09-12 11:20",
    message:
      "Seeking a comprehensive structural and interior redesign for our newly acquired 19th-century triplex. We wish to harmonize classical French boiserie moldings with minimalist Italian stone masonry and custom bronze joinery.",
    isVip: true,
  },
  {
    id: "BK-8894",
    clientName: "Maximilian Sterling",
    clientEmail: "m.sterling@sterlingcap.com",
    clientPhone: "+1 (212) 555-0194",
    service: "Luxury Penthouse Staging",
    propertyType: "Central Park Tower Penthouse",
    location: "57th Street Billionaires' Row, NYC",
    preferredDate: "2026-09-28",
    preferredTime: "10:00 EST",
    budget: "$300,000 – $400,000",
    squareFootage: "6,200 sq ft",
    status: "CONTACTED",
    createdAt: "2026-09-11 16:45",
    updatedAt: "2026-09-12 09:15",
    message:
      "Looking for turnkey luxury staging and bespoke furnishing curation for a duplex penthouse overlooking Central Park prior to private private collector viewing.",
    isVip: true,
  },
  {
    id: "BK-8889",
    clientName: "Countess Sofia de Montmirail",
    clientEmail: "sofia@montmirail-heritage.fr",
    clientPhone: "+33 6 12 34 56 78",
    service: "Private Residence Renovation",
    propertyType: "Provencal Country Estate & Bastide",
    location: "Saint-Rémy-de-Provence, France",
    preferredDate: "2026-10-05",
    preferredTime: "11:00 CET",
    budget: "$850,000+",
    squareFootage: "9,500 sq ft",
    status: "CONFIRMED",
    createdAt: "2026-09-08 14:10",
    updatedAt: "2026-09-10 17:30",
    message:
      "Complete restoration and spatial reconfiguration of historic 18th-century bastide including custom subterranean wine vault, primary master wing, and artisan limestone terraces.",
    isVip: true,
  },
  {
    id: "BK-8876",
    clientName: "Julian Thorne",
    clientEmail: "j.thorne@mayfairadvisors.co.uk",
    clientPhone: "+44 20 7946 0912",
    service: "Bespoke Estate Advisory",
    propertyType: "Mayfair Townhouse & Mews",
    location: "Upper Brook Street, London W1K",
    preferredDate: "2026-10-12",
    preferredTime: "15:00 GMT",
    budget: "$250,000 – $350,000",
    squareFootage: "5,400 sq ft",
    status: "CONFIRMED",
    createdAt: "2026-09-05 09:30",
    updatedAt: "2026-09-07 11:20",
    message:
      "Advisory consultation and material specification audit for high-spec Grade II listed townhouse restoration.",
    isVip: false,
  },
  {
    id: "BK-8862",
    clientName: "Aria Kensington-Choi",
    clientEmail: "aria.choi@pacificcrest.sg",
    clientPhone: "+65 6789 0123",
    service: "Prime Commercial & Hospitality",
    propertyType: "Private Members Club & Lounge",
    location: "Marina Bay, Singapore",
    preferredDate: "2026-08-20",
    preferredTime: "16:00 SGT",
    budget: "$1,200,000+",
    squareFootage: "12,000 sq ft",
    status: "COMPLETED",
    createdAt: "2026-08-01 10:00",
    updatedAt: "2026-09-02 18:00",
    message:
      "Full interior concept and bespoke bespoke acoustic paneling, onyx cocktail bar, and curated lighting for private VIP salon.",
    isVip: true,
  },
  {
    id: "BK-8850",
    clientName: "Harrison & Camille Drake",
    clientEmail: "drake.private@icloud.com",
    clientPhone: "+1 (310) 555-8921",
    service: "Haute Architectural Interior",
    propertyType: "Bel Air Modernist Villa",
    location: "Bellagio Road, Bel Air, Los Angeles",
    preferredDate: "2026-09-18",
    preferredTime: "13:00 PST",
    budget: "$650,000 – $900,000",
    squareFootage: "8,100 sq ft",
    status: "CONTACTED",
    createdAt: "2026-09-09 18:22",
    updatedAt: "2026-09-11 14:10",
    message:
      "We want to replace all synthetic finishes with natural travertine, fluted dark walnut, and integrated low-voltage lighting systems.",
    isVip: false,
  },
  {
    id: "BK-8841",
    clientName: "David Sterling-Cole",
    clientEmail: "d.sterling@monaco-invest.mc",
    clientPhone: "+377 98 76 54 32",
    service: "Luxury Penthouse Staging",
    propertyType: "Larvotto Seafront Duplex",
    location: "Avenue Princesse Grace, Monaco",
    preferredDate: "2026-08-15",
    preferredTime: "11:30 CET",
    budget: "$200,000 – $280,000",
    squareFootage: "3,900 sq ft",
    status: "CANCELLED",
    createdAt: "2026-08-10 12:00",
    updatedAt: "2026-08-14 09:00",
    message:
      "Property sale concluded earlier than anticipated; consultation postponed until subsequent acquisition in Cap d'Antibes.",
    isVip: false,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-101",
    name: "Eleanor Vance-Roche",
    email: "eleanor.roche@vancegroup.ch",
    phone: "+41 22 819 9021",
    location: "Geneva / Paris",
    avatar: "EV",
    totalBookings: 2,
    totalBudget: "$950,000",
    latestBookingDate: "2026-09-12",
    latestService: "Haute Architectural Interior",
    status: "VIP Client",
    joinedDate: "2025-11-14",
    notesCount: 4,
  },
  {
    id: "CUST-102",
    name: "Maximilian Sterling",
    email: "m.sterling@sterlingcap.com",
    phone: "+1 (212) 555-0194",
    location: "New York, USA",
    avatar: "MS",
    totalBookings: 3,
    totalBudget: "$720,000",
    latestBookingDate: "2026-09-11",
    latestService: "Luxury Penthouse Staging",
    status: "VIP Client",
    joinedDate: "2025-04-20",
    notesCount: 6,
  },
  {
    id: "CUST-103",
    name: "Countess Sofia de Montmirail",
    email: "sofia@montmirail-heritage.fr",
    phone: "+33 6 12 34 56 78",
    location: "Aix-en-Provence, France",
    avatar: "SM",
    totalBookings: 1,
    totalBudget: "$850,000+",
    latestBookingDate: "2026-09-08",
    latestService: "Private Residence Renovation",
    status: "Active Client",
    joinedDate: "2026-09-08",
    notesCount: 2,
  },
  {
    id: "CUST-104",
    name: "Julian Thorne",
    email: "j.thorne@mayfairadvisors.co.uk",
    phone: "+44 20 7946 0912",
    location: "London, UK",
    avatar: "JT",
    totalBookings: 2,
    totalBudget: "$520,000",
    latestBookingDate: "2026-09-05",
    latestService: "Bespoke Estate Advisory",
    status: "Active Client",
    joinedDate: "2026-01-18",
    notesCount: 3,
  },
  {
    id: "CUST-105",
    name: "Aria Kensington-Choi",
    email: "aria.choi@pacificcrest.sg",
    phone: "+65 6789 0123",
    location: "Singapore",
    avatar: "AC",
    totalBookings: 4,
    totalBudget: "$2,400,000",
    latestBookingDate: "2026-08-01",
    latestService: "Prime Commercial & Hospitality",
    status: "VIP Client",
    joinedDate: "2024-08-10",
    notesCount: 9,
  },
  {
    id: "CUST-106",
    name: "Harrison & Camille Drake",
    email: "drake.private@icloud.com",
    phone: "+1 (310) 555-8921",
    location: "Los Angeles, USA",
    avatar: "HD",
    totalBookings: 1,
    totalBudget: "$750,000",
    latestBookingDate: "2026-09-09",
    latestService: "Haute Architectural Interior",
    status: "New Lead",
    joinedDate: "2026-09-09",
    notesCount: 1,
  },
];

export const INITIAL_MESSAGES: InquiryMessage[] = [
  {
    id: "MSG-401",
    senderName: "Eleanor Vance-Roche",
    senderEmail: "eleanor.roche@vancegroup.ch",
    senderPhone: "+41 22 819 9021",
    senderAvatar: "EV",
    subject: "Avenue Montaigne Triplex Architectural Redesign Consultation",
    snippet:
      "We are finalizing the acquisition of the 3rd and 4th floors on Avenue Montaigne and would like to schedule an in-person design exploration...",
    fullMessage:
      "Dear Paima Architectural Studio,\n\nWe are in the process of concluding the acquisition of the historic triplex residence on Avenue Montaigne (8th Arrondissement, Paris). We admire your studio's restraint, mastery of natural French limestone, and minimalist brass detailing.\n\nWe would appreciate scheduling an on-site confidential design consultation with your principal architect for late September. Please let us know your team's availability.\n\nWarm regards,\nEleanor Vance-Roche",
    service: "Haute Architectural Interior",
    timestamp: "Today, 11:20 AM",
    isUnread: true,
    isStarred: true,
    replies: [],
  },
  {
    id: "MSG-402",
    senderName: "Maximilian Sterling",
    senderEmail: "m.sterling@sterlingcap.com",
    senderPhone: "+1 (212) 555-0194",
    senderAvatar: "MS",
    subject: "Turnkey Curation for 57th St Billionaires' Row Duplex",
    snippet:
      "Confirming our phone conversation earlier today regarding staging timeline and bespoke furniture pieces...",
    fullMessage:
      "Hello Dilkhush and team,\n\nThank you for the preliminary call this morning. As discussed, our deadline for the private collector reception is early November. We need turnkey staging across the grand salon, double-height library, and primary master suite.\n\nPlease forward the formal proposal and retainer documentation at your earliest convenience.\n\nBest,\nMaximilian",
    service: "Luxury Penthouse Staging",
    timestamp: "Yesterday, 04:45 PM",
    isUnread: true,
    isStarred: true,
    replies: [
      {
        sender: "Dilkhush Kumar",
        text: "Thank you Maximilian. Our team has drafted the preliminary curation storyboard and schedule of works. We will send the secure portal link by 12:00 PM EST.",
        timestamp: "Today, 09:15 AM",
        isAdmin: true,
      },
    ],
  },
  {
    id: "MSG-403",
    senderName: "Countess Sofia de Montmirail",
    senderEmail: "sofia@montmirail-heritage.fr",
    senderPhone: "+33 6 12 34 56 78",
    senderAvatar: "SM",
    subject: "Architectural Survey Date Confirmation — Bastide Saint-Rémy",
    snippet:
      "October 5th is confirmed on our calendar. Our estate manager will meet you at the main gate at 11:00 CET...",
    fullMessage:
      "Bonjour,\n\nI am delighted to confirm our appointment on Monday, October 5th at 11:00 CET at our Bastide in Saint-Rémy-de-Provence. Our head estate curator, M. Laurent, will accompany us with the 18th-century floor plans and structural survey reports.\n\nWe look forward to an inspiring collaboration.\n\nBien cordialement,\nSofia de Montmirail",
    service: "Private Residence Renovation",
    timestamp: "Sep 10, 05:30 PM",
    isUnread: false,
    isStarred: false,
    replies: [],
  },
  {
    id: "MSG-404",
    senderName: "Julian Thorne",
    senderEmail: "j.thorne@mayfairadvisors.co.uk",
    senderPhone: "+44 20 7946 0912",
    senderAvatar: "JT",
    subject: "Material Specifications Audit for Upper Brook Street",
    snippet:
      "Could we review the acoustic insulation specs and heritage timber treatments during next week's session?",
    fullMessage:
      "Dear Dilkhush,\n\nPrior to our meeting on October 12th, our structural engineers have requested early review of the acoustic decoupling membrane specifications for the upper mews floors. Could you share the technical data sheets when available?\n\nKind regards,\nJulian Thorne",
    service: "Bespoke Estate Advisory",
    timestamp: "Sep 07, 11:20 AM",
    isUnread: false,
    isStarred: false,
    replies: [],
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarBookingEvent[] = [
  {
    id: "EV-1",
    bookingId: "BK-8901",
    title: "Avenue Montaigne On-Site Consultation",
    clientName: "Eleanor Vance-Roche",
    service: "Haute Architectural Interior",
    date: "2026-09-24",
    startTime: "14:30",
    endTime: "16:30",
    status: "NEW",
    location: "Paris, 8th Arr.",
  },
  {
    id: "EV-2",
    bookingId: "BK-8894",
    title: "Billionaires' Row Staging Walkthrough",
    clientName: "Maximilian Sterling",
    service: "Luxury Penthouse Staging",
    date: "2026-09-28",
    startTime: "10:00",
    endTime: "12:00",
    status: "CONTACTED",
    location: "New York, 57th St",
  },
  {
    id: "EV-3",
    bookingId: "BK-8889",
    title: "Bastide Saint-Rémy Architectural Survey",
    clientName: "Countess Sofia de Montmirail",
    service: "Private Residence Renovation",
    date: "2026-10-05",
    startTime: "11:00",
    endTime: "14:00",
    status: "CONFIRMED",
    location: "Saint-Rémy-de-Provence",
  },
  {
    id: "EV-4",
    bookingId: "BK-8876",
    title: "Mayfair Townhouse Heritage Audit",
    clientName: "Julian Thorne",
    service: "Bespoke Estate Advisory",
    date: "2026-10-12",
    startTime: "15:00",
    endTime: "17:00",
    status: "CONFIRMED",
    location: "London W1K",
  },
  {
    id: "EV-5",
    bookingId: "BK-8850",
    title: "Bel Air Villa Virtual Material Review",
    clientName: "Harrison Drake",
    service: "Haute Architectural Interior",
    date: "2026-09-18",
    startTime: "13:00",
    endTime: "14:30",
    status: "CONTACTED",
    location: "Los Angeles / Video",
  },
];

export interface DashboardKPIs {
  totalBookings: {
    value: number;
    change: string;
    isPositive: boolean;
    period: string;
  };
  newInquiries: {
    value: number;
    change: string;
    isPositive: boolean;
    period: string;
  };
  confirmedProjects: {
    value: number;
    change: string;
    isPositive: boolean;
    period: string;
  };
  completedEstates: {
    value: number;
    change: string;
    isPositive: boolean;
    period: string;
  };
  pipelineValue: string;
}

export const INITIAL_KPIS: DashboardKPIs = {
  totalBookings: {
    value: 148,
    change: "+12.4%",
    isPositive: true,
    period: "vs last month",
  },
  newInquiries: {
    value: 14,
    change: "+4 today",
    isPositive: true,
    period: "pending review",
  },
  confirmedProjects: {
    value: 38,
    change: "+18.2%",
    isPositive: true,
    period: "active contracts",
  },
  completedEstates: {
    value: 96,
    change: "+100%",
    isPositive: true,
    period: "lifetime luxury projects",
  },
  pipelineValue: "$18.4M",
};
