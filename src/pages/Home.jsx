import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const typewriterWords = [
    "Full-Stack Developer",
    "Tech-Enthusiast",
];

const TYPING_SPEED = 80;
const ERASING_SPEED = 40;
const DELAY_AFTER_TYPING = 1200;
const DELAY_AFTER_ERASING = 400;

const Typewriter = () => {
    const [text, setText] = useState("");
    const [isErasing, setIsErasing] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        let timeout;
        const currentWord = typewriterWords[wordIndex];

        if (!isErasing && charIndex <= currentWord.length) {
            timeout = setTimeout(() => {
                setText(currentWord.substring(0, charIndex));
                setCharIndex((prev) => prev + 1);
            }, TYPING_SPEED);
        } else if (isErasing && charIndex >= 0) {
            timeout = setTimeout(() => {
                setText(currentWord.substring(0, charIndex));
                setCharIndex((prev) => prev - 1);
            }, ERASING_SPEED);
        } else if (!isErasing && charIndex > currentWord.length) {
            timeout = setTimeout(() => setIsErasing(true), DELAY_AFTER_TYPING);
        } else if (isErasing && charIndex < 0) {
            timeout = setTimeout(() => {
                setIsErasing(false);
                setWordIndex((prev) => (prev + 1) % typewriterWords.length);
                setCharIndex(0);
            }, DELAY_AFTER_ERASING);
        }
        return () => clearTimeout(timeout);
    }, [charIndex, isErasing, wordIndex]);

    return (
        <span className="text-3xl md:text-4xl font-mono text-yellow-300 h-12 inline-block">
            {text}
            <span className="border-r-2 border-yellow-300 animate-pulse ml-1">&nbsp;</span>
        </span>
    );
};

const techIcons = [
    { src: "/assets/icons/Vue.svg", alt: "Vue.js", glow: "bg-green-400/70" },
    { src: "/assets/icons/c-sharp.svg", alt: "C#", glow: "bg-purple-500/70" },
    { src: "/assets/icons/sql.png", alt: "SQL", glow: "bg-blue-400/70" },
];

function ContactSection() {
    const [form, setForm] = React.useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = React.useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
    }

    return (
        <section id="contact" className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-black/80 to-zinc-900">
            <div className="w-full max-w-lg bg-zinc-900 rounded-3xl shadow-xl p-8 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-white mb-6">Contact Me</h2>
                {submitted ? (
                    <div className="text-yellow-300 text-lg font-semibold text-center py-8">Thank you for reaching out! I will get back to you soon.</div>
                ) : (
                    <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
                        <label className="flex flex-col gap-2 text-white font-medium">
                            Name
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="rounded-lg px-4 py-3 bg-zinc-800 text-white border-2 border-zinc-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                                placeholder="Your name"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-white font-medium">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="rounded-lg px-4 py-3 bg-zinc-800 text-white border-2 border-zinc-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                                placeholder="you@email.com"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-white font-medium">
                            Message
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="rounded-lg px-4 py-3 bg-zinc-800 text-white border-2 border-zinc-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none"
                                placeholder="How can I help you?"
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-2 bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-md transition-all text-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 border border-yellow-200"
                        >
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

const Home = () => {
    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 relative overflow-hidden">
            <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-tr from-blue-500/10 via-purple-700/10 to-pink-500/10" />
            <section className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto py-24 px-4 gap-12">
                <div className="flex-1 flex flex-col items-center md:items-start justify-center">
                    <div className="mb-6 flex items-center justify-center">
                        <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                                src="/assets/dev-icon.png"
                                alt="Dev Icon"
                                className="w-full h-full object-cover"
                                draggable={false}
                                style={{ aspectRatio: '1 / 1' }}
                            />
                        </div>
                    </div>
                    <h1 className="font-ubuntu text-5xl md:text-6xl font-extrabold text-white text-center md:text-left mb-2">
                        <span className="text-white">Diogo </span>
                        <span className="text-yellow-300">Oliveira</span>
                    </h1>
                    <div className="mt-2 mb-6">
                        <Typewriter />
                    </div>
                    <Link to="/contact" className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-md transition-all text-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 border border-yellow-200">
                        Contact Me
                    </Link>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md p-8 rounded-3xl bg-black/60 backdrop-blur-lg shadow-lg border border-zinc-700 flex flex-col items-center gap-6">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Main Tech Stack</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {techIcons.map((icon, idx) => (
                                <div key={idx} className="relative group w-14 h-14 flex items-center justify-center">
                                    <span className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-80 transition duration-300 pointer-events-none ${icon.glow}`}></span>
                                    <img src={icon.src} alt={icon.alt} className="w-14 h-14 object-contain relative z-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
export { ContactSection }; 