import React, { useState } from "react";

const socialLinks = [
    {
        href: "https://www.linkedin.com/in/oliveiradiogo1/",
        icon: "/assets/icons/linkedin.png",
        alt: "LinkedIn",
    },
    {
        href: "https://github.com/OliveiraDiogo1",
        icon: "/assets/icons/github.png",
        alt: "GitHub",
    },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
    }

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.05)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.03)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(251,191,36,0.02)_0%,transparent_50%)]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-3xl px-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                        Thanks for taking the time to{" "}
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                            reach out
                        </span>
                    </h1>
                    <h2 className="text-lg md:text-xl text-zinc-300 font-light">
                        How can I help you today?
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Contact Form */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 rounded-3xl blur-xl opacity-30"></div>

                    <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-zinc-800/50">
                        {submitted ? (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-zinc-300">Thank you for reaching out! I will get back to you soon.</p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField("")}
                                            required
                                            placeholder="Your name"
                                            className={`w-full rounded-xl px-4 py-3 bg-zinc-800/50 text-white border-2 outline-none backdrop-blur-sm transition-all duration-300 ${focusedField === "name" || form.name
                                                ? "border-yellow-300 ring-2 ring-yellow-200/20 shadow-yellow-300/10"
                                                : "border-zinc-700 hover:border-zinc-600"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField("")}
                                            required
                                            placeholder="you@email.com"
                                            className={`w-full rounded-xl px-4 py-3 bg-zinc-800/50 text-white border-2 outline-none backdrop-blur-sm transition-all duration-300 ${focusedField === "email" || form.email
                                                ? "border-yellow-300 ring-2 ring-yellow-200/20 shadow-yellow-300/10"
                                                : "border-zinc-700 hover:border-zinc-600"
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("message")}
                                        onBlur={() => setFocusedField("")}
                                        required
                                        rows={4}
                                        placeholder="How can I help you? Tell me about your project, ideas, or questions..."
                                        className={`w-full rounded-xl px-4 py-3 bg-zinc-800/50 text-white border-2 outline-none resize-none backdrop-blur-sm transition-all duration-300 ${focusedField === "message" || form.message
                                            ? "border-yellow-300 ring-2 ring-yellow-200/20 shadow-yellow-300/10"
                                            : "border-zinc-700 hover:border-zinc-600"
                                            }`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="relative mt-2 bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg group overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Send Message
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                </button>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-zinc-800/50">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
                                    <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full border border-zinc-300 group-hover:border-yellow-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                        <img
                                            src={link.icon}
                                            alt={link.alt}
                                            className="w-6 h-6 transition-all duration-300"
                                        />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}