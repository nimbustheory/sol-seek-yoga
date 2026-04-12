import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Waves
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { AdminContext } from "./main.jsx";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Sol Seek Yoga, Santa Barbara
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "SOL SEEK",
  subtitle: "YOGA",
  tagline: "Where movement makes community.",
  logoMark: "SS",
  logoImage: "https://irp.cdn-website.com/96388b03/dms3rep/multi/sol-seek_light.svg",
  description: "A sanctuary for seekers of joy, growth, and connection — in the heart of downtown Santa Barbara.",
  heroLine1: "SEEK",
  heroLine2: "THE LIGHT",

  address: { street: "25 E De La Guerra St", city: "Santa Barbara", state: "CA", zip: "93101" },
  phone: "(805) 259-9070",
  email: "hello@solseekyoga.com",
  neighborhood: "Downtown Santa Barbara",
  website: "https://solseekyoga.com",
  social: { instagram: "@solseekyoga" },

  theme: {
    accent:     { h: 36,  s: 85, l: 52 },   // Golden amber sunlight
    accentAlt:  { h: 200, s: 55, l: 45 },    // Pacific ocean blue
    warning:    { h: 12,  s: 80, l: 52 },     // Warm coral
    primary:    { h: 220, s: 25, l: 12 },     // Deep navy-charcoal
    surface:    { h: 42,  s: 30, l: 98 },     // Warm cream white
    surfaceDim: { h: 40,  s: 22, l: 94 },     // Sandy off-white
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
    outdoorClasses: true,
  },

  classCapacity: 28,
  specialtyCapacity: 18,
};

// ═══════════════════════════════════════════════════════════════
//  IMAGES — sourced from Sol Seek Yoga website
// ═══════════════════════════════════════════════════════════════
const CDN = "https://lirp.cdn-website.com/96388b03/dms3rep/multi/opt";
const IMAGES = {
  hero: `${CDN}/Annie-SB-640w.jpg`,
  studioInterior: `${CDN}/SolSeek_044-640w.jpg`,
  classAction: `${CDN}/SolSeek_230-640w.jpg`,
  newMember: `${CDN}/new-member-special-640w.jpg`,
  studioWarm: `${CDN}/Sol_Sek_SB_8-640w.jpg`,
  classGroup: `${CDN}/_DSC0009-640w.jpg`,
  logoDark: "https://irp.cdn-website.com/96388b03/dms3rep/multi/sol-seek_dark.svg",
  logoLight: "https://irp.cdn-website.com/96388b03/dms3rep/multi/sol-seek_light.svg",
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -14),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 28),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.09),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.2),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#1e2430",
  textMuted: "#6a7080",
  textFaint: "#a0a8b4",
  border: "#e2ddd4",
  borderLight: "#f0ebe4",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Sol Seek Yoga Santa Barbara
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Justin", lastName: "Randolph", role: "Owner & Lead Teacher", certs: ["E-RYT-500", "Katonah Yoga 200hr", "Yin Yoga", "Spinal Health"], specialties: ["Vinyasa Flow", "Warm Yin", "Katonah Yoga"], yearsTeaching: 20, bio: "Justin, a former professional actor, found solace in yoga during his early 20s, overcoming anxiety and body image challenges. His classes combine playfulness with soulfulness, creating an environment that fosters personal exploration and joy." },
  { id: "t2", firstName: "Natalie", lastName: "Strandberg", role: "Senior Teacher", certs: ["E-RYT-500", "Yoga Therapy", "Pranayama"], specialties: ["Meditation", "Pranayama", "Deep Flow"], yearsTeaching: 18, bio: "Natalie was introduced to yoga and meditation as a young girl, but it wasn't until she moved to Santa Barbara that yoga became an essential part of her life. Her classes blend mindfulness with movement for a truly holistic experience." },
  { id: "t3", firstName: "Sierra", lastName: "Davis", role: "Teacher", certs: ["RYT-500", "Restorative Yoga", "Sound Healing"], specialties: ["Roots Flow", "Flow + Yin", "Restorative"], yearsTeaching: 8, bio: "Sierra's teaching weaves grounding root-centered flows with intuitive movement. Her Roots classes are beloved for building strong foundational poses and deep body awareness." },
  { id: "t4", firstName: "Jill", lastName: "Moreno", role: "Teacher", certs: ["RYT-200", "Power Yoga", "Inversions"], specialties: ["Power Flow", "Inversions", "Arm Balances"], yearsTeaching: 10, bio: "Jill is known for her strong flow classes that challenge practitioners to find their edge. Her sequences build toward inversions and arm balances with clear, supportive instruction." },
  { id: "t5", firstName: "Emma", lastName: "Chen", role: "Teacher", certs: ["RYT-200", "Vinyasa", "Mindfulness"], specialties: ["Vinyasa Flow", "Outdoor Yoga", "Mindfulness"], yearsTeaching: 5, bio: "Emma brings a light, joyful energy to her vinyasa classes. She loves teaching outdoor sessions at La Mesa Park, connecting movement with Santa Barbara's natural beauty." },
  { id: "t6", firstName: "Luke", lastName: "Harmon", role: "Teacher", certs: ["RYT-500", "Ashtanga", "Yoga Philosophy"], specialties: ["Ashtanga", "Meditation", "Philosophy"], yearsTeaching: 12, bio: "Luke's approach to yoga integrates deep philosophical inquiry with physically rigorous practice. His classes invite practitioners to explore the connection between ancient wisdom and modern life." },
  { id: "t7", firstName: "Sam", lastName: "Hoppes", role: "Prenatal Specialist & Doula", certs: ["RYT-200", "Prenatal Yoga", "Certified Doula"], specialties: ["Prenatal Yoga", "Postnatal Yoga", "Birth Support"], yearsTeaching: 6, bio: "Sam is an experienced doula and passionate advocate for holistic well-being during pregnancy and postpartum. Her pre- and post-natal classes offer a safe, nurturing space for mamas." },
  { id: "t8", firstName: "Lisa", lastName: "Morales", role: "Teacher", certs: ["RYT-200", "Yin Yoga", "Restorative"], specialties: ["Yin Yoga", "Restorative", "Flow"], yearsTeaching: 7, bio: "Lisa creates deeply calming, spacious classes that invite surrender. Her Friday evening flows are a beloved weekly ritual for the Sol Seek community." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Sun-Drenched Flow", type: "VINYASA",
  style: "Flow", temp: "Warm Room", duration: 60,
  description: "A radiant vinyasa flow moving from grounding standing sequences into heart-opening backbends and expansive twists. Set in the warm Sunroom with windows open to the Santa Barbara breeze.",
  intention: "Let the light in. On the mat and in your life.",
  teacherTip: "This class moves with the breath. If you lose the breath, simplify the movement until you find it again.",
  playlist: "Golden Hour — Justin's Sol Seek Mix",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Roots & Rise", type: "ROOTS", style: "Roots", temp: "Room Temp", duration: 60, description: "Sierra's signature grounding practice: strong standing poses, hip openers, and intentional transitions. Build your foundation from the ground up.", intention: "What roots you also frees you.", teacherTip: "Press all four corners of each foot. Feel the earth push back." },
  { id: "p-y2", date: offsetDate(-2), name: "Deep Yin Surrender", type: "YIN", style: "Yin", temp: "Moon Room", duration: 75, description: "Long-held floor poses in the intimate Moon Room. Fascia release, nervous system reset, and profound stillness under soft colored lights.", intention: "In stillness, we remember who we are.", teacherTip: "If you feel nothing, you're in the right place. Give it time." },
  { id: "p-y3", date: offsetDate(-3), name: "BURN", type: "BURN", style: "Burn", temp: "Heated", duration: 45, description: "High-energy fusion of yoga, HIIT, and functional strength. Heart-pumping, muscle-building, sweat-dripping fun.", intention: "Strength is a form of self-love." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Sound Bath + Yin", type: "SPECIAL", style: "Restorative", temp: "Moon Room", duration: 90, description: "A gentle yin practice followed by a healing sound bath with crystal bowls, chimes, and deep vibrational resonance. The intimate Moon Room with its shifting light creates an otherworldly atmosphere.", intention: "Sound is medicine. Stillness is home.", teacherTip: "Bring an extra layer — you'll cool down during the sound journey." };

const CLASSES_TODAY = [
  { id: "cl1", time: "09:00", type: "Vinyasa Flow", coach: "Justin Randolph", capacity: 28, registered: 24, waitlist: 0 },
  { id: "cl2", time: "10:30", type: "Roots", coach: "Sierra Davis", capacity: 28, registered: 28, waitlist: 2 },
  { id: "cl3", time: "12:15", type: "Flow + Yin", coach: "Sierra Davis", capacity: 28, registered: 18, waitlist: 0 },
  { id: "cl4", time: "16:30", type: "Power Flow", coach: "Jill Moreno", capacity: 28, registered: 22, waitlist: 0 },
  { id: "cl5", time: "17:30", type: "Burn", coach: "Justin Randolph", capacity: 22, registered: 22, waitlist: 3 },
  { id: "cl6", time: "18:30", type: "Vinyasa Flow", coach: "Natalie Strandberg", capacity: 28, registered: 26, waitlist: 0 },
  { id: "cl7", time: "19:45", type: "Yin", coach: "Lisa Morales", capacity: 20, registered: 14, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "09:00", type: "Vinyasa Flow", coach: "Justin" }, { time: "10:30", type: "Chair Yoga", coach: "Priya" }, { time: "12:15", type: "Flow", coach: "Emma" }, { time: "17:00", type: "Roots", coach: "Sierra" }, { time: "17:30", type: "Outdoor Roots", coach: "Sierra", location: "La Mesa Park" }, { time: "19:00", type: "Deep Flow", coach: "Natalie" }] },
  { day: "Tuesday", classes: [{ time: "12:15", type: "Flow + Yin", coach: "Sierra" }, { time: "17:00", type: "Power Flow", coach: "Jill" }, { time: "17:30", type: "Outdoor Flow + Yin", coach: "Sierra", location: "La Mesa Park" }, { time: "18:15", type: "Burn", coach: "Justin" }, { time: "19:30", type: "Yin", coach: "Lisa" }] },
  { day: "Wednesday", classes: [{ time: "09:00", type: "Vinyasa Flow", coach: "Justin" }, { time: "10:30", type: "Chair Yoga", coach: "Megan" }, { time: "12:15", type: "Flow", coach: "Natalie" }, { time: "17:30", type: "Outdoor Flow", coach: "Emma", location: "La Mesa Park" }, { time: "18:00", type: "Prenatal Yoga", coach: "Sam" }, { time: "19:00", type: "Deep Flow", coach: "Luke" }] },
  { day: "Thursday", classes: [{ time: "12:15", type: "Flow + Yin", coach: "Sierra" }, { time: "17:00", type: "Power Flow", coach: "Jill" }, { time: "17:30", type: "Outdoor Flow 2", coach: "Jill", location: "La Mesa Park" }, { time: "18:15", type: "Burn", coach: "Justin" }, { time: "19:30", type: "Restorative", coach: "Lisa" }] },
  { day: "Friday", classes: [{ time: "09:00", type: "Vinyasa Flow", coach: "Justin" }, { time: "10:30", type: "Chair Yoga", coach: "Priya" }, { time: "12:15", type: "Flow", coach: "Emma" }, { time: "17:30", type: "Outdoor Flow", coach: "Lisa", location: "La Mesa Park" }, { time: "18:00", type: "Flow", coach: "Lisa" }] },
  { day: "Saturday", classes: [{ time: "09:15", type: "Vinyasa Flow", coach: "Justin" }, { time: "10:45", type: "Burn", coach: "Jill" }, { time: "11:15", type: "Chair Yoga", coach: "Priya" }] },
  { day: "Sunday", classes: [{ time: "09:30", type: "Prenatal Yoga", coach: "Sam" }, { time: "10:30", type: "Flow", coach: "Emma" }, { time: "17:00", type: "Kundalini", coach: "Natalie" }, { time: "19:00", type: "Vinyasa (Unheated)", coach: "Luke" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Laya M.", milestone: "100 Classes", message: "Sol Seek has taught me to practice mindfulness and find inner peace. This community is everything.", date: today, celebrations: 36 },
  { id: "cf2", user: "Reza K.", milestone: "30-Day Streak", message: "30 days straight! The welcoming, judgment-free atmosphere here made it possible.", date: today, celebrations: 22 },
  { id: "cf3", user: "Pantea R.", milestone: "1 Year Member", message: "One year at Sol Seek! Sierra's Roots class keeps me coming back every single week.", date: offsetDate(-1), celebrations: 45 },
  { id: "cf4", user: "Michelle M.", milestone: "First Crow Pose!", message: "Finally held crow! The positivity and light at this studio makes you believe you can do anything.", date: offsetDate(-1), celebrations: 29 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Inversion": { icon: ArrowUpRight, color: "#8b5cf6" },
  "Crow Pose": { icon: Star, color: "#3b82f6" },
  "1 Year Member": { icon: Award, color: T.success },
  "Beach Yogi": { icon: Waves, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "200-Hour Yoga Teacher Training", date: "2026-09-12", startTime: "08:00", type: "Teacher Training", description: "Over 3 months and 200 hours, dive into the heart of yoga with Sol Seek's expert faculty. Build life-long relationships, uncover your teaching niche, and learn to lead truly inclusive yoga classes.", fee: 2800, maxParticipants: 20, registered: 8, status: "Early Bird Open" },
  { id: "ev2", name: "Full Moon Sound Bath", date: offsetDate(6), startTime: "19:30", type: "Sound Bath", description: "A meditative journey through sound in the Moon Room — crystal bowls, chimes, and deep vibrational healing under shifting colored lights. A perfect way to honor the lunar cycle.", fee: 25, maxParticipants: 18, registered: 16, status: "Almost Full" },
  { id: "ev3", name: "Beach Sunrise Flow", date: offsetDate(3), startTime: "06:30", type: "Outdoor Event", description: "Welcome the morning sun with a beachside vinyasa flow at Leadbetter Beach. Open to all levels. Mats not provided — bring your own or a towel!", fee: 15, maxParticipants: 30, registered: 22, status: "Registration Open" },
  { id: "ev4", name: "Community Warm Yin Sing-Along", date: offsetDate(8), startTime: "18:30", type: "Special Event", description: "An acoustic, unplugged Warm Yin Sing-Along with Justin & Katie. Long holds, beautiful stretches, and your favorite songs played live. Pure Sol Seek magic.", fee: 20, maxParticipants: 25, registered: 19, status: "Registration Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "New Member Special", type: "intro", price: 59, period: "21 days unlimited", features: ["Unlimited classes for 21 days", "All class styles included", "Mat rental included", "Perfect first step"], popular: false },
  { id: "m2", name: "Visitor Pass", type: "visitor", price: 75, period: "1 week unlimited", features: ["7 days unlimited yoga", "Mat rental included", "Valid at all 3 locations", "Ideal for travelers"], popular: false },
  { id: "m3", name: "Mini Membership", type: "limited", price: 89, period: "/month", features: ["4 classes per month", "All class styles", "Member discounts at local businesses", "Freeze up to 1 month/year"], popular: false },
  { id: "m4", name: "Unlimited", type: "unlimited", price: 138, period: "/month", annualPrice: 1296, features: ["Unlimited in-studio + outdoor classes", "On-demand video library", "Guest passes for new friends", "20% off workshops & events", "Local business partner discounts", "Freeze up to 1 month/year"], popular: true },
  { id: "m5", name: "Drop-In", type: "drop-in", price: 28, period: "per class", features: ["Single class credit", "Valid for 12 months", "All class styles", "No commitment"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "200-Hour Teacher Training — Fall 2026!", message: "Our next YTT is coming to Santa Barbara this fall. Dive into the heart of yoga and become a confident, inclusive teacher. Early bird pricing available now.", type: "celebration", pinned: true },
  { id: "a2", title: "Outdoor Classes Every Weekday!", message: "Join us at La Mesa Park at 5:30 PM Monday through Friday. Reduce your screen time and find your yoga community outside.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Laya Mehta", email: "laya@email.com", membership: "Unlimited", status: "active", joined: "2023-03-15", checkIns: 312, lastVisit: today },
  { id: "mem2", name: "Reza Ahmadi", email: "reza@email.com", membership: "Unlimited", status: "active", joined: "2022-09-01", checkIns: 445, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Pantea Rahimian", email: "pantea@email.com", membership: "Unlimited", status: "active", joined: "2025-03-24", checkIns: 178, lastVisit: today },
  { id: "mem4", name: "Michelle Martinez", email: "michelle@email.com", membership: "Unlimited", status: "active", joined: "2025-01-10", checkIns: 94, lastVisit: today },
  { id: "mem5", name: "Alex Rivera", email: "alex@email.com", membership: "Mini", status: "active", joined: "2025-11-01", checkIns: 22, lastVisit: offsetDate(-3) },
  { id: "mem6", name: "Taylor Kim", email: "taylor@email.com", membership: "Unlimited", status: "frozen", joined: "2024-06-01", checkIns: 187, lastVisit: offsetDate(-45) },
  { id: "mem7", name: "Jordan Santos", email: "jordan@email.com", membership: "Unlimited (Annual)", status: "active", joined: "2024-01-01", checkIns: 356, lastVisit: today },
  { id: "mem8", name: "Casey Nguyen", email: "casey@email.com", membership: "New Member Special", status: "active", joined: "2026-03-18", checkIns: 5, lastVisit: offsetDate(-1) },
];

const ADMIN_METRICS = {
  activeMembers: 186, memberChange: 14,
  todayCheckIns: 64, weekCheckIns: 412,
  monthlyRevenue: 25680, revenueChange: 11.2,
  renewalRate: 89.4, workshopRevenue: 3100,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 72, avg: 12 }, { day: "Tue", total: 58, avg: 12 },
    { day: "Wed", total: 68, avg: 11 }, { day: "Thu", total: 62, avg: 12 },
    { day: "Fri", total: 54, avg: 11 }, { day: "Sat", total: 48, avg: 16 },
    { day: "Sun", total: 52, avg: 13 },
  ],
  revenue: [
    { month: "Sep", revenue: 20100 }, { month: "Oct", revenue: 21400 },
    { month: "Nov", revenue: 22200 }, { month: "Dec", revenue: 21000 },
    { month: "Jan", revenue: 23500 }, { month: "Feb", revenue: 24800 },
    { month: "Mar", revenue: 25680 },
  ],
  classPopularity: [
    { name: "9:00 AM", pct: 86 }, { name: "10:30 AM", pct: 98 },
    { name: "12:15 PM", pct: 65 }, { name: "4:30 PM", pct: 78 },
    { name: "5:30 PM", pct: 94 }, { name: "6:30 PM", pct: 92 },
    { name: "7:45 PM", pct: 70 },
  ],
  membershipBreakdown: [
    { name: "Unlimited Monthly", value: 94, color: T.accent },
    { name: "Unlimited Annual", value: 38, color: T.success },
    { name: "Mini Membership", value: 32, color: T.warning },
    { name: "Drop-In / Intro", value: 22, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ background: `linear-gradient(165deg, ${T.bg} 0%, hsl(220,20%,16%) 100%)`, color: "#fff", padding: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={IMAGES.hero} alt="" loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} onError={e => { e.target.style.display = "none"; }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(30,36,48,.85) 0%, rgba(30,36,48,.7) 100%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, padding: "32px 22px" }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 54, lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0, fontWeight: 300 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic", fontWeight: 500 }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#a8b0c0", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.accent }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#60657a", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.accent} fill={myC > 0 ? T.accent : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#60657a", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Classes" subtitle="Past, present, and upcoming practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Schedule" subtitle="Reserve your spot — classes fill up fast" />
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Sound") || cls.type.includes("Kundalini") || cls.type.includes("Prenatal");
          const isOutdoor = cls.location;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${isOutdoor ? T.successBorder : T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                  {isOutdoor && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.successGhost, color: T.success }}>Outdoor</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}{isOutdoor ? ` · ${cls.location}` : ""}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => {
    setSaved("log");
    setTimeout(() => setSaved(null), 2000);
    setReflection({ energy: 4, focus: 4, notes: "" });
  };

  const streakDays = 15;
  const totalClasses = 94;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="My Practice" subtitle="Track your journey and celebrate growth" />

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>7</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reflection Form */}
      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "7-Day Streak", "30-Day Streak", "Crow Pose", "Beach Yogi"].includes(name);
            const IconComp = badge.icon;
            return (
              <div key={name} style={{ padding: "16px 14px", borderRadius: 12, background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : "transparent"}`, textAlign: "center", opacity: earned ? 1 : 0.45, transition: "all 0.2s" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 8px", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconComp size={24} color={earned ? badge.color : T.textFaint} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p>
                {earned && <p style={{ fontSize: 11, color: T.accent, margin: "4px 0 0", fontWeight: 600 }}>Earned!</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Community" subtitle="Celebrate each other's journeys" />

      {/* Mantra Banner */}
      <div style={{ background: `linear-gradient(135deg, ${T.accentGhost}, ${T.successGhost})`, border: `1px solid ${T.accentBorder}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20, textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: T.text, margin: 0, lineHeight: 1.4 }}>
          "Lokah Samastah Sukhino Bhavantu"
        </p>
        <p style={{ fontSize: 12, color: T.textMuted, margin: "6px 0 0" }}>May all beings everywhere be happy and free.</p>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#3a4050", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.accentBorder : T.border}`, background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.accent} fill={myC > 0 ? T.accent : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Teachers" subtitle="Meet the Sol Seek teaching team" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#4a5060", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Membership" subtitle="Find your path to practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Popular
              </div>
            )}
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            {tier.annualPrice && (
              <p style={{ fontSize: 12, color: T.success, fontWeight: 600, marginBottom: 12 }}>
                Annual: ${tier.annualPrice}/yr (save ${tier.price * 12 - tier.annualPrice})
              </p>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#4a5060" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Events" subtitle="Workshops, trainings, and special offerings" />
      {EVENTS.map((ev, evIdx) => {
        const eventImages = [IMAGES.studioWarm, IMAGES.classGroup, IMAGES.classAction, IMAGES.studioInterior];
        return (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(220,20%,16%))`, padding: 0, color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <img src={eventImages[evIdx % eventImages.length]} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} onError={e => { e.target.style.display = "none"; }} />
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: "20px 18px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 500 }}>{ev.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#a8b0c0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#4a5060", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={`$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              Register Now
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+8 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3545" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2a3545", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3545" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2a3545", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a2030", border: "1px solid #2a3545", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Capacity Utilization">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ADMIN_CHARTS.classPopularity.map((slot, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 64 }}>{slot.name}</span>
                <div style={{ flex: 1, height: 8, background: "#2a3545", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${slot.pct}%`, height: "100%", background: slot.pct >= 90 ? T.warning : T.accent, borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: slot.pct >= 90 ? T.warning : T.accent, minWidth: 36 }}>{slot.pct}%</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => {
    if (filter !== "all" && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1a2030", border: "1px solid #2a3545", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1a2030", color: filter === f ? "#fff" : "#9ca3af" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a3545" }}>
              {["Member", "Membership", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #2a3545" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a3545" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #2a3545" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#2a3545", color: "#9ca3af" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2a3545", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2a3545", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>{formatDateShort(ev.date)} · {ev.type} · ${ev.fee}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Pricing & Memberships</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#1a2030", border: `1px solid ${tier.popular ? T.accent : "#2a3545"}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>MOST POPULAR</span>}
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#fff", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}> {tier.period}</span></div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0" }}>{tier.features.length} features</p>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #2a3545", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#0f1520", border: "1px solid #2a3545", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#0f1520", border: "1px solid #2a3545", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "members", "class cards", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#2a3545", color: audience === a ? "#fff" : "#9ca3af" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Sent Broadcasts</h3>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 10, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "#fff", margin: 0, fontSize: 14, fontWeight: 600 }}>{a.title}</h4>
              {a.pinned && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>PINNED</span>}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const p = practice;
  const isFeatured = variant === "featured";
  const isToday = p.date === today;
  const isFuture = p.date > today;

  const typeColors = {
    VINYASA: T.accent, ROOTS: T.success, YIN: T.success, BURN: T.warning,
    HEATED: T.warning, SPECIAL: "#8b5cf6", EDGE: T.warning,
  };
  const color = typeColors[p.type] || T.accent;

  return (
    <div onClick={onToggle} style={{ background: isFeatured ? `linear-gradient(135deg, ${T.bg}, hsl(220,20%,16%))` : T.bgCard, border: `1px solid ${isFeatured ? "transparent" : T.border}`, borderRadius: 14, overflow: "hidden", cursor: onToggle ? "pointer" : "default", position: "relative" }}>
      {isFeatured && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={IMAGES.classAction} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} onError={e => { e.target.style.display = "none"; }} />
        </div>
      )}
      <div style={{ padding: isFeatured ? "20px 18px" : "16px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 4, background: `${color}20`, color }}>{p.type}</span>
          {p.style && <span style={{ fontSize: 11, color: isFeatured ? "#a8b0c0" : T.textMuted }}>{p.style}</span>}
          {p.temp && <span style={{ fontSize: 11, color: isFeatured ? "#a8b0c0" : T.textMuted }}>· {p.temp}</span>}
          {isToday && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginLeft: "auto" }}>TODAY</span>}
          {isFuture && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.successGhost, color: T.success, marginLeft: "auto" }}>UPCOMING</span>}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isFeatured ? 26 : 20, margin: "0 0 4px", color: isFeatured ? "#fff" : T.text, fontWeight: 500 }}>{p.name}</h3>
        <p style={{ fontSize: 12, color: isFeatured ? "#a8b0c0" : T.textMuted }}>{formatDateShort(p.date)} · {p.duration} min</p>
        <p style={{ fontSize: 13, color: isFeatured ? "#c8ccd8" : "#4a5060", lineHeight: 1.5, margin: "8px 0 0" }}>{p.description}</p>
      </div>
      {(isFeatured || expanded) && (p.intention || p.teacherTip || p.playlist) && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${isFeatured ? "rgba(255,255,255,.08)" : T.borderLight}`, paddingTop: 14 }}>
          {p.intention && (
            <div style={{ display: "flex", gap: 8 }}>
              <Heart size={14} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, fontStyle: "italic", color: isFeatured ? "#d8dce8" : "#5a6070", margin: 0, lineHeight: 1.4 }}>{p.intention}</p>
            </div>
          )}
          {p.teacherTip && (
            <div style={{ display: "flex", gap: 8 }}>
              <Info size={14} color={T.success} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: isFeatured ? "#a8b0c0" : T.textMuted, margin: 0, lineHeight: 1.4 }}>{p.teacherTip}</p>
            </div>
          )}
          {p.playlist && (
            <div style={{ display: "flex", gap: 8 }}>
              <Music size={14} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: isFeatured ? "#a8b0c0" : T.textMuted, margin: 0 }}>{p.playlist}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 12px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={36} color={T.textFaint} style={{ margin: "0 auto 8px" }} />
      <p style={{ color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 13, color: T.accent, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.text, margin: 0, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ background: `linear-gradient(165deg, ${T.bg}, hsl(220,20%,16%))`, borderRadius: 16, color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src={IMAGES.newMember} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, padding: "24px 20px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 500 }}>New to Sol Seek?</h3>
        <p style={{ fontSize: 13, color: "#a8b0c0", margin: "0 0 16px", lineHeight: 1.5 }}>21 days of unlimited yoga for $59. Discover what makes this community special — on the mat and beyond.</p>
        <button onClick={() => setPage("membership")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, cursor: "pointer" }}>
          View Memberships <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1a2030", border: "1px solid #2a3545", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#fff", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
// Modals use absolute positioning to stay within phone frame
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>LM</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Laya Mehta</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Unlimited Member · Since Mar 2023</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Workshops", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Practice Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>25 E De La Guerra St · Downtown Santa Barbara</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", text: "Sierra's 10:30 AM Roots class tomorrow is almost full — reserve your spot!", time: "2h ago", read: false },
    { id: "n2", text: "You're only 6 classes away from your 100 Classes milestone!", time: "1d ago", read: false },
    { id: "n3", text: "New: Beach Sunrise Flow this Saturday at Leadbetter Beach!", time: "2d ago", read: true },
    { id: "n4", text: "Pantea R. just hit 1 Year Member — celebrate in the community feed!", time: "3d ago", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.borderLight : T.accentBorder}` }}>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0, marginTop: 6 }} />}
              <div>
                <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.4 }}>{n.text}</p>
                <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const isFull = classData.registered >= classData.capacity;

  const handleConfirm = () => {
    onConfirm(classData.id);
    setConfirmed(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: 16, width: "90%", maxWidth: 350, padding: "24px 20px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={32} color={T.accent} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: "0 0 4px" }}>
              {isFull ? "On the Waitlist!" : "You're In!"}
            </h3>
            <p style={{ fontSize: 13, color: T.textMuted }}>{classData.type} · {fmtTime(classData.time)}</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: "0 0 16px" }}>Confirm Reservation</h3>
            <div style={{ background: T.bgDim, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>{classData.type}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
                {classData.dayLabel || formatDateShort(classData.date)} · {fmtTime(classData.time)} · {classData.coach}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <Users size={14} color={isFull ? T.warning : T.accent} />
                <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : T.accent }}>
                  {isFull ? `Full — join waitlist (${classData.waitlist + 1} ahead)` : `${classData.capacity - classData.registered} spots left`}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em" }}>
                {isFull ? "Join Waitlist" : "Reserve Spot"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [page, setPage] = useState(isAdmin ? "admin-dashboard" : "home");
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});

  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 }));
  }, []);

  const openReservation = useCallback((classData) => {
    setReservationClass(classData);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 }));
  }, []);

  // Sync page when entering admin mode from DemoWrapper
  useEffect(() => {
    if (isAdmin && !page.startsWith("admin-")) {
      setPage("admin-dashboard");
    }
  }, [isAdmin]);

  const handleLogoClick = () => {
    setPage("home");
  };

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Classes", icon: CalendarDays },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "community", label: "Community", icon: Heart },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "events", label: "Events", icon: PartyPopper },
    { id: "membership", label: "Membership", icon: CreditCard },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: PartyPopper },
    { id: "admin-pricing", label: "Pricing", icon: CreditCard },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
  ];

  const isMoreActive = moreItems.some(item => page === item.id);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "events": return <EventsPage />;
      case "membership": return <MembershipPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f1520", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e5e7eb" }}>
          <aside style={{ width: 240, background: "#141c2a", borderRight: "1px solid #2a3545", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, overflow: "auto" }}>
            <div style={{ padding: "16px 14px", borderBottom: "1px solid #2a3545", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#fff", display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span>
                <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Portal</span>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #2a3545", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#ef4444", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: 600 }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [page]);

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto", height: "100%", display: "flex", flexDirection: "column", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
        
        {/* Header — fixed at top */}
        <header style={{ flexShrink: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            {STUDIO_CONFIG.logoImage ? (
              <img src={STUDIO_CONFIG.logoImage} alt={STUDIO_CONFIG.name} style={{ height: 32 }} onError={e => { e.target.style.display = "none"; e.target.nextElementSibling && (e.target.nextElementSibling.style.display = "flex"); }} />
            ) : null}
            <div style={{ display: STUDIO_CONFIG.logoImage ? "none" : "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.04em" }}>{STUDIO_CONFIG.name}</span>
                <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
              </div>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable content area */}
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
          {renderPage()}
        </main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav — fixed at bottom */}
        <nav style={{ flexShrink: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
