// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Moon,
    Sun,
    Github,
    Linkedin,
    Mail,
    Phone,
    Globe,
    ChevronRight,
    ExternalLink,
    Search,
    Filter,
} from "lucide-react";

/* -------------------- Helper Components -------------------- */
const Container = ({ children, className = "" }) => (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
    </div>
);

const Section = ({ id, title, subtitle, children }) => (
    <section id={id} className="py-20 sm:py-24">
        <Container>
            <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            {subtitle}
                        </p>
                    )}
                </div>
                <a
                    href={`#${id}`}
                    className="hidden sm:flex items-center gap-2 text-sm text-cyan-700 dark:text-cyan-300"
                >
                    <ChevronRight className="h-4 w-4" />
                    section link
                </a>
            </div>
            {children}
        </Container>
    </section>
);

const Tag = ({ children }) => (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-gray-200 dark:ring-gray-700 bg-white/80 dark:bg-white/5 backdrop-blur">
        {children}
    </span>
);

const Card = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl shadow-md shadow-black/5 dark:shadow-black/40 bg-white dark:bg-zinc-900 ring-1 ring-gray-200 dark:ring-zinc-800 ${className}`}
    >
        {children}
    </div>
);

/* -------------------- Data -------------------- */
const PROFILE = {
    name: "Ayomipo Soyinka",
    role: "Software Engineer",
    blurb: "I build fast, accessible web & mobile apps. I love clean UI, good DX, and shipping business value.",
    location: "Lagos, Nigeria",
    resumeUrl: "#",
    photo: "./src/assets/my_pic.jpeg",
    socials: {
        github: "https://github.com/AY-CODED",
        linkedin: "https://www.linkedin.com/in/ayomipo-soyinka-208156335/",
        website: "https://my-portfolio-mauve-six-31.vercel.app/",
        email: "mailto:ayomiposoyinka@gmail.com",
        phone: "tel:+2349048582274",
    },
};

const SKILLS = [
    "HTML",
    "CSS",
    "JavaScript",
    "Bootstrap",
    "C Programing",
    "React.js",
    "React Native",
    "Tailwind CSS",
    "Vite",
    "Git & GitHub",
];

const PROJECTS = [
    {
        title: "GameHub ",
        description:
            "Flashcards, audio, quizzes and stories for Yoruba, Igbo, and Hausa. Offline-first with local caching.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        image: "./src/assets/Game-Web.png",
        url: "https://game-web-khaki.vercel.app/",
        repo: "https://github.com/AY-CODED/Game-Web",
        highlight: "200+ families in beta; 4.8★ feedback",
        category: "Web",
    },
    {
        title: "MovieHub",
        description:
            "Buy & sell farm products with escrow and delivery tracking. Admin analytics dashboard included.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        image: "./src/assets/MovieHub.png",
        url: "https://movie-hub-nu-lilac.vercel.app/",
        repo: "https://github.com/AY-CODED/MovieHub",
        highlight: "Processed ₦5m+ GMV in pilot",
        category: "web",
    },
    {
        title: "Pato Place",
        description:
            "Beautiful directory of beaches with filters, maps and favorites. Accessible and super fast.",
        tech: ["HTML", "CSS", "JavaScript"],
        image: "./src/assets/pato-place-project.png",
        url: "https://pato-place-seven.vercel.app/",
        repo: "https://github.com/AY-CODED/pato_place",
        highlight: "95+ Lighthouse score across the board",
        category: "web",
    },
    {
        title: "Suites",
        description:
            "Beautiful directory of beaches with filters, maps and favorites. Accessible and super fast.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        image: "./src/assets/Suites.png",
        url: "https://suites-hotel.vercel.app/",
        repo: "https://github.com/AY-CODED/Suites-Hotel",
        highlight: "95+ Lighthouse score across the board",
        category: "web",
    },
    {
        title: "Young Mothers & Child Haven Foundation",
        description:
            "Beautiful directory of beaches with filters, maps and favorites. Accessible and super fast.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        image: "./src/assets/YMCH.png",
        url: "https://www.ymchfoundation.org/",
        repo: "https://github.com/Ibthecoder/ChildFoundationWe cannot follow you. ",
        highlight: "95+ Lighthouse score across the board",
        category: "web",
    },
];

// const EXPERIENCE = [
//     {
//         role: "Frontend Engineer (Contract)",
//         company: "NairaPay",
//         date: "2024 – 2025",
//         bullets: [
//             "Led migration to React + Vite; build time down 60%.",
//             "Shipped reusable UI kit; delivery speed up 30%.",
//             "Implemented CI with GitHub Actions and tests.",
//         ],
//     },
//     {
//         role: "Mobile Developer (Intern)",
//         company: "AgriTech Labs",
//         date: "2023 – 2024",
//         bullets: [
//             "Built offline-first modules with SQLite.",
//             "Improved app crash-free sessions to 99.3%.",
//         ],
//     },
// ];

// const TESTIMONIALS = [
//   {
//     quote:
//       "Ayomipo communicates clearly, ships fast, and cares about user experience. Exactly who you want on a small team.",
//     author: "Bimpe A.",
//     role: "PM, NairaPay",
//   },
//   {
//     quote:
//       "Turned fuzzy ideas into a polished product. Our dashboard finally makes sense.",
//     author: "Miracle O.",
//     role: "CTO, FarmLink",
//   },
// ];

/* -------------------- Utilities -------------------- */
const classNames = (...arr) => arr.filter(Boolean).join(" ");

function useDarkMode() {
    const [dark, setDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return (
            localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia?.("(prefers-color-scheme: dark)").matches)
        );
    });
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle("dark", dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);
    return [dark, setDark];
}

function useDebouncedValue(value, delay = 250) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

/* -------------------- Main Component -------------------- */
export default function App() {
    const [dark, setDark] = useDarkMode();
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("all");
    const debounced = useDebouncedValue(query);

    const filtered = useMemo(() => {
        const q = debounced.toLowerCase();
        return PROJECTS.filter(
            (p) =>
                (tab === "all" || p.category === tab) &&
                (p.title.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.tech.join(" ").toLowerCase().includes(q))
        );
    }, [debounced, tab]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100">
            {/* ---------- Navbar ---------- */}
            <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-zinc-950/80 border-b border-gray-200 dark:border-zinc-800">
                <Container className="flex h-16 items-center justify-between">
                    <a
                        href="#"
                        className="font-bold text-xl text-cyan-700 dark:text-cyan-300"
                    >
                        {PROFILE.name}
                    </a>
                    <div className="flex items-center gap-4">
                        <a href="#projects" className="hover:text-cyan-500">
                            Projects
                        </a>
                        <a href="#experience" className="hover:text-cyan-500">
                            Experience
                        </a>
                        <a href="#skills" className="hover:text-cyan-500">
                            Skills
                        </a>
                        <a href="#contact" className="hover:text-cyan-500">
                            Contact
                        </a>
                        <button
                            onClick={() => setDark(!dark)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            {dark ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </Container>
            </nav>

            {/* ---------- Hero ---------- */}
            <header className="relative overflow-hidden py-20 sm:py-32">
                <Container className="relative z-10 text-center">
                    <motion.img
                        src={PROFILE.photo}
                        alt={PROFILE.name}
                        className="mx-auto h-32 w-32 rounded-full ring-4 ring-cyan-400 dark:ring-cyan-600 mb-6 object-cover"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                    />
                    <h1 className="text-4xl sm:text-5xl font-extrabold">
                        {PROFILE.name}
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        {PROFILE.role}
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto">{PROFILE.blurb}</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <a
                            href={PROFILE.socials.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Github />
                        </a>
                        <a
                            href={PROFILE.socials.linkedin}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Linkedin />
                        </a>
                        <a
                            href={PROFILE.socials.website}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Globe />
                        </a>
                        <a href={PROFILE.socials.email}>
                            <Mail />
                        </a>
                        <a href={PROFILE.socials.phone}>
                            <Phone />
                        </a>
                    </div>
                </Container>
            </header>

            {/* ---------- Projects ---------- */}
            <Section
                id="projects"
                title="Projects"
                subtitle="Some things I've built"
            >
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-sm"
                        />
                    </div>
                    <select
                        value={tab}
                        onChange={(e) => setTab(e.target.value)}
                        className="rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2 px-3 text-sm"
                    >
                        <option value="all">All</option>
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                    </select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <AnimatePresence>
                        {filtered.map((p) => (
                            <motion.div
                                key={p.title}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card>
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="rounded-t-2xl h-48 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">
                                            {p.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {p.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {p.tech.map((t) => (
                                                <Tag key={t}>{t}</Tag>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-xs text-cyan-600 dark:text-cyan-400">
                                            {p.highlight}
                                        </p>
                                        <div className="mt-3 flex gap-3 text-sm">
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 hover:text-cyan-500"
                                            >
                                                <ExternalLink className="h-4 w-4" />{" "}
                                                Live
                                            </a>
                                            <a
                                                href={p.repo}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 hover:text-cyan-500"
                                            >
                                                <Github className="h-4 w-4" />{" "}
                                                Code
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Section>

            {/* ---------- Experience ---------- */}
            {/* <Section id="experience" title="Experience">
                <div className="space-y-6">
                    {EXPERIENCE.map((job) => (
                        <Card key={job.company} className="p-6">
                            <h3 className="font-semibold text-lg">
                                {job.role}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {job.company} • {job.date}
                            </p>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                                {job.bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </Section> */}

            {/* ---------- Skills ---------- */}
            <Section id="skills" title="Skills">
                <div className="flex flex-wrap gap-2">
                    {SKILLS.map((s) => (
                        <Tag key={s}>{s}</Tag>
                    ))}
                </div>
            </Section>

            {/* ---------- Testimonials ---------- */}
            {/* <Section id="testimonials" title="Testimonials">
                <div className="grid gap-6 sm:grid-cols-2">
                    {TESTIMONIALS.map((t) => (
                        <Card key={t.author} className="p-6">
                            <p className="italic">“{t.quote}”</p>
                            <p className="mt-3 font-semibold">{t.author}</p>
                            <p className="text-sm text-gray-500">{t.role}</p>
                        </Card>
                    ))}
                </div>
            </Section> */}

            {/* ---------- Contact ---------- */}
            <Section id="contact" title="Get In Touch">
                <div className="text-center">
                    <p className="mb-4">
                        I’m open to freelance, collaborations, or just a chat.
                    </p>
                    <a
                        href={PROFILE.socials.email}
                        className="inline-block rounded-lg bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700"
                    >
                        Say Hello
                    </a>
                </div>
            </Section>

            {/* ---------- Footer ---------- */}
            <footer className="border-t border-gray-200 dark:border-zinc-800 py-6 text-center text-sm">
                <Container>
                    © {new Date().getFullYear()} {PROFILE.name}. All rights
                    reserved.
                </Container>
            </footer>
        </div>
    );
}
