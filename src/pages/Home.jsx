import React, { useEffect, useState } from "react";

const skills = [
    "REACT",
    "MYSQL",
    // Add more skills as needed
];

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

const AboutSection = () => (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-yellow-400 text-gray-900 py-24 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6">About Me</h2>
        <p className="max-w-2xl text-center text-lg md:text-xl font-medium">
            I’m Diogo Oliveira, a passionate developer who loves building beautiful and functional web experiences. I enjoy working with modern technologies, learning new things, and collaborating with others to create impactful digital products. I’m always curious, always improving, and always ready for the next challenge.
        </p>
    </section>
);

const Home = () => {
    return (
        <main className="w-full">
            <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black relative overflow-hidden">
                <div className="flex flex-row items-center justify-center w-full h-screen px-10 z-10 relative">
                    {/* Left: Dev icon above greeting, icon centered with text, text left-aligned */}
                    <div className="flex-1 flex flex-col justify-center items-start">
                        <div className="flex flex-col items-start">
                            <img src="/assets/dev-icon.png" alt="Dev Icon" className="w-72 h-72 object-contain mb-4 self-center" />
                            <h1 className="font-ubuntu text-6xl md:text-7xl font-extrabold text-white leading-tight whitespace-nowrap">
                                Hi, I'm{' '}
                                <span className="bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                                    Diogo Oliveira
                                </span>
                            </h1>
                            <div className="mt-4">
                                <Typewriter />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <AboutSection />
        </main>
    );
};

export default Home; 