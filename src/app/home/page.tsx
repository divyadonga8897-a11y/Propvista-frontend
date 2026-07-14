"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Search, Building2, ShieldCheck, Sparkles, ArrowRight, MapPin,
    BadgePercent, Home as HomeIcon, Layers, IndianRupee, BrainCircuit, FileText,
    Bell, CreditCard, Users, Wrench, CheckCircle2, ChevronDown,
    Star, Phone, Mail, MessageSquare,
} from "lucide-react";
import Footer from "@/components/Footer";
import { apiService } from "@/services/apiService";
import type { Apartment, Flat } from "@/types/real-estate";
// ─── Animation helpers ────────────────────────────────────────
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Features data ────────────────────────────────────────────
const FEATURES = [
    {
        icon: Building2,
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-500/10 border-blue-500/20",
        title: "Smart Flat Booking",
        desc: "Browse floor-by-floor, check live availability, hold a flat instantly, then buy or rent — all in one flow.",
    },
    {
        icon: CreditCard,
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-500/10 border-emerald-500/20",
        title: "Razorpay Payments",
        desc: "Secure payment gateway integration for booking fees, maintenance dues, and monthly rent collections.",
    },
    {
        icon: FileText,
        color: "from-violet-500 to-violet-600",
        bg: "bg-violet-500/10 border-violet-500/20",
        title: "Digital Documents",
        desc: "Agreements, receipts, and ownership documents auto-generated and stored securely in your account.",
    },
    {
        icon: Wrench,
        color: "from-orange-500 to-orange-600",
        bg: "bg-orange-500/10 border-orange-500/20",
        title: "Maintenance Portal",
        desc: "Residents raise service tickets, track repairs, and pay monthly maintenance dues from a single dashboard.",
    },
    {
        icon: Bell,
        color: "from-pink-500 to-pink-600",
        bg: "bg-pink-500/10 border-pink-500/20",
        title: "Announcements",
        desc: "Society admins broadcast important notices — water supply, events, security alerts — directly to residents.",
    },
    {
        icon: BrainCircuit,
        color: "from-cyan-500 to-cyan-600",
        bg: "bg-cyan-500/10 border-cyan-500/20",
        title: "AI Assistant (Groq)",
        desc: "24/7 AI-powered chatbot to answer property queries, maintenance questions, and society FAQs instantly.",
    },
];

// ─── How It Works steps ───────────────────────────────────────
const HOW_STEPS = [
    { step: "01", title: "Browse Apartments", desc: "Explore PropVista Heights, Green Valley Residency, and Skyline Residency — all in Nandyal, AP." },
    { step: "02", title: "Select & Hold a Flat", desc: "View floor plans, photos, pricing. Hold your preferred flat to block it for 48 hours." },
    { step: "03", title: "Buy or Rent", desc: "Choose purchase or rental. Complete KYC, sign agreements digitally, and pay securely via Razorpay." },
    { step: "04", title: "Receive Documents", desc: "Ownership certificate, receipts, and agreements are auto-generated and delivered to your dashboard." },
    { step: "05", title: "Become a Resident", desc: "Access the full society portal — manage maintenance, visitors, facilities, and connect with AI assistant." },
];

// ─── Testimonials ─────────────────────────────────────────────
const TESTIMONIALS = [
    {
        name: "Ravi Shankar",
        flat: "PropVista Heights • 3BHK • Floor 4",
        avatar: "RS",
        color: "from-blue-500 to-blue-600",
        text: "The booking process was incredibly smooth. I held the flat in the morning and completed the payment by evening. The digital agreement was ready within hours!",
        rating: 5,
    },
    {
        name: "Priya Reddy",
        flat: "Green Valley Residency • 2BHK • Floor 2",
        avatar: "PR",
        color: "from-emerald-500 to-emerald-600",
        text: "As a resident, the society portal is a game-changer. I raise maintenance tickets, check announcements, and pay dues all from my phone. Brilliant!",
        rating: 5,
    },
    {
        name: "Anil Nair",
        flat: "Skyline Residency • 3BHK • Floor 6",
        avatar: "AN",
        color: "from-violet-500 to-violet-600",
        text: "The AI assistant answered all my questions about the society rules at 11 PM! PropVista AI truly feels like a premium product.",
        rating: 5,
    },
];

// ─── FAQs ────────────────────────────────────────────────────
const FAQS = [
    {
        q: "Which city does PropVista AI currently serve?",
        a: "PropVista AI currently serves Nandyal, Andhra Pradesh — with three premium residential communities: PropVista Heights, Green Valley Residency, and Skyline Residency.",
    },
    {
        q: "How does flat holding work?",
        a: "When you hold a flat, it's blocked for 48 hours exclusively for you. During this window, you can complete KYC, choose Buy or Rent, and make payment without losing the flat.",
    },
    {
        q: "What payment methods are supported?",
        a: "We use Razorpay, which supports UPI, net banking, credit/debit cards, and EMI options.",
    },
    {
        q: "How do I access the Resident Portal?",
        a: "Once your purchase or rental is confirmed and documents are issued, your account is automatically upgraded to Resident. You'll then see the society portal in your dashboard.",
    },
    {
        q: "Can I manage maintenance payments online?",
        a: "Yes! Residents can view outstanding maintenance dues, pay them via Razorpay, and download receipts — all from the resident dashboard.",
    },
    {
        q: "Is my data and payment information secure?",
        a: "Absolutely. We use Supabase for secure authentication and data storage, and all payments are processed through Razorpay's PCI-DSS compliant gateway.",
    },
];

const STATUS_COLORS: Record<string, string> = {
    "Available": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Ready to Move": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Under Construction": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

// ─── Component ────────────────────────────────────────────────
export default function Home() {
    const [search, setSearch] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [contactSent, setContactSent] = useState(false);

    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [flats, setFlats] = useState<Flat[]>([]);

    useEffect(() => {
    Promise.all([apiService.getApartments(), apiService.getFlats()])
            .then(([apts, fls]) => {
                setApartments(apts);
                setFlats(fls);
            })
            .catch((err) => {
                console.error("Failed to load apartments/flats:", err);
                // Leave arrays empty — page degrades gracefully
            });
    }, []);

    const filteredApts = apartments.filter(
        (apt) =>
            apt.name.toLowerCase().includes(search.toLowerCase()) ||
            apt.address.toLowerCase().includes(search.toLowerCase())
    );

    const handleContact = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSent(true);
    };

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-950 pb-32 pt-24 sm:pt-36">
                {/* Background glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-blue-600/8 blur-3xl" />
                <div className="absolute top-20 right-0 h-[400px] w-[600px] rounded-full bg-emerald-500/6 blur-3xl" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 mb-6">
                            <BadgePercent className="h-3.5 w-3.5" />
                            📍 Nandyal, Andhra Pradesh — Smart Apartment Platform
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl max-w-4xl mx-auto leading-[1.1]"
                    >
                        Find Your Perfect Home{" "}
                        <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            in Nandyal.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        PropVista AI combines real estate booking with an AI-powered society management platform.
                        Browse, hold, buy or rent — then manage your community all in one place.
                    </motion.p>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mx-auto mt-10 max-w-2xl"
                    >
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/80 p-2 shadow-2xl backdrop-blur-md">
                            <div className="relative flex-1">
                                <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-500" />
                                <input
                                    id="hero-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search PropVista Heights, Green Valley..."
                                    className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none"
                                    suppressHydrationWarning
                                />
                            </div>
                            <Link
                                href={`/properties?search=${search}`}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/25 shrink-0"
                            >
                                Search Flats
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-12 flex flex-wrap items-center justify-center gap-10"
                    >
                        {[
                            { label: "Apartment Communities", value: "3", icon: Building2 },
                            { label: "Total Flats", value: "72+", icon: HomeIcon },
                            { label: "Floors", value: "9", icon: Layers },
                            { label: "Starting Price", value: "₹35L", icon: IndianRupee },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex flex-col items-center gap-1.5">
                                <Icon className="h-4 w-4 text-slate-500" />
                                <span className="text-3xl font-black text-white">{value}</span>
                                <span className="text-xs text-slate-400 font-medium">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Platform Features</span>
                        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                            Everything you need,{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                                in one platform
                            </span>
                        </h2>
                        <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm">
                            PropVista AI is not just a listings site — it's a complete real estate lifecycle platform from booking to residency.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                className={`rounded-2xl border p-6 ${bg} hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── APARTMENT COMMUNITIES ─────────────────────────────── */}
            <section id="apartments" className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-12"
                    >
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Communities</span>
                            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                                Three Premium Residences
                            </h2>
                            <p className="mt-3 text-sm text-slate-500 max-w-lg">
                                All located in Nandyal, Andhra Pradesh — choose your ideal community.
                            </p>
                        </div>
                        <Link
                            href="/properties"
                            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            View all flats <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {filteredApts.map((apt) => {
                            const aptFlats = flats.filter(f => f.apartment_id === apt.id);
                            const availableCount = aptFlats.filter((f) => f.status === "Available").length;
                            const minPrice = aptFlats.length > 0 ? Math.min(...aptFlats.map((f) => f.price_buy ?? Infinity)) : 0;

                            return (
                                <motion.div
                                    key={apt.id}
                                    variants={fadeUp}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                                        <img
                                            src={apt.cover_image}
                                            alt={apt.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className={`absolute top-3 right-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${STATUS_COLORS[apt.status] ?? "bg-slate-900/80 text-white border-transparent"}`}>
                                            {apt.status}
                                        </span>
                                        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                            {availableCount} flats available
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>Nandyal, Andhra Pradesh</span>
                                        </div>
                                        <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            <Link href={`/properties/${apt.id}`}>{apt.name}</Link>
                                        </h3>
                                        <p className="mt-2 flex-grow text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {apt.description}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {[
                                                `${apt.total_floors} Floors`,
                                                `${aptFlats.length} Flats`,
                                                `₹${(minPrice / 100000).toFixed(0)}L+`,
                                            ].map((label) => (
                                                <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                                                    {label}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Construction</span>
                                                <span className="text-[10px] font-bold text-slate-700">{apt.status === "Completed" ? 100 : 85}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${apt.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${apt.status === "Completed" ? 100 : 85}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400">{apt.owner_name}</span>
                                            <Link
                                                href={`/properties/${apt.id}`}
                                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                                            >
                                                Explore Flats <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Simple Process</span>
                        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                            From Visitor to Resident —{" "}
                            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                                5 Steps
                            </span>
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4"
                    >
                        {HOW_STEPS.map(({ step, title, desc }, idx) => (
                            <motion.div
                                key={step}
                                variants={fadeUp}
                                className="relative flex flex-col items-center text-center"
                            >
                                {idx < HOW_STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-blue-200 to-transparent z-0" />
                                )}
                                <div className="relative z-10 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-500/30 mb-4">
                                    {step}
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── TESTIMONIALS ──────────────────────────────────────── */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_70%)]" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Testimonials</span>
                        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                            Loved by our residents
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {TESTIMONIALS.map(({ name, flat, avatar, color, text, rating }) => (
                            <motion.div
                                key={name}
                                variants={fadeUp}
                                className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 backdrop-blur-sm hover:border-slate-600/60 transition-all"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {Array(rating).fill(0).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-black text-white`}>
                                        {avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{name}</p>
                                        <p className="text-[10px] text-slate-400">{flat}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FAQs ──────────────────────────────────────────────── */}
            <section id="faq" className="py-24 bg-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">FAQ</span>
                        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                            Frequently Asked Questions
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-3"
                    >
                        {FAQS.map(({ q, a }, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <button
                                    id={`faq-${idx}`}
                                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    suppressHydrationWarning
                                >
                                    {q}
                                    <ChevronDown
                                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${openFaq === idx ? "rotate-180" : ""}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT ───────────────────────────────────────────── */}
            <section id="contact" className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Contact Us</span>
                            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                                Have questions? Let&apos;s talk.
                            </h2>
                            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                                Our team is available to help you with apartment inquiries, booking assistance, and society management queries.
                            </p>
                            <div className="mt-8 space-y-4">
                                {[
                                    { icon: MapPin, label: "Location", value: "Nandyal, Andhra Pradesh, India — 518501" },
                                    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                                    { icon: Mail, label: "Email", value: "divyadonga8897@gmail.com" },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                            <Icon className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                                            <p className="text-sm text-slate-700 font-medium">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {contactSent ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">Message Sent!</h3>
                                    <p className="mt-2 text-sm text-slate-500">We&apos;ll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContact} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Send a Message</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                                placeholder="Your name"
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                                placeholder="your@email.com"
                                                suppressHydrationWarning
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                                        <textarea
                                            id="contact-message"
                                            rows={4}
                                            required
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div>
                                    <button
                                        id="contact-submit"
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20"
                                        suppressHydrationWarning
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
