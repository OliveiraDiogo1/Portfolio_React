import React, { useEffect, useState } from "react";
import Home from "./pages/Home";

const SocialBar = () => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-8 z-30 bg-white bg-opacity-90 rounded-xl py-8 px-3 shadow-lg">
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-8 h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/twitter.png" alt="Twitter" className="w-8 h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/github.png" alt="GitHub" className="w-8 h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full flex justify-end items-center px-10 py-6 z-30 bg-white-900 bg-opacity-90 backdrop-blur-md border-b border-gray-800">
    <div className="flex space-x-8">
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Home</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">About</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Projects</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Contact</button>
    </div>
  </nav>
);

function App() {
  const [showSocialBar, setShowSocialBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowSocialBar(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      {showSocialBar && <SocialBar />}
      <Home />
    </div>
  );
}

export default App;
