import React, { useEffect, useState, useRef } from "react";
import Home from "./pages/Home";

const skills = [
  "REACT",
  "SQL",
  "PYTHON",
  "VUE.JS",
  "JAVASCRIPT",
  "ASP",
  "GIT",
  "KUBERNETES",
  "DOCKER",
];

const SkillsSection = () => {
  const repeatedSkills = [...skills, ...skills, ...skills];
  return (
    <section className="w-full flex flex-col items-center justify-center bg-black min-h-[50vh] py-12">
      <div className="w-[95vw] max-w-[1800px] bg-black rounded-3xl overflow-hidden flex flex-col items-center justify-start">
        <h2 className="text-[8vw] font-extrabold text-white text-center mt-0 mb-8 tracking-widest leading-none">SKILLS</h2>
        <div className="overflow-hidden w-full flex items-center justify-center" style={{ height: '8rem' }}>
          <div className="inline-block animate-marquee-slow whitespace-nowrap align-middle">
            {repeatedSkills.map((skill, idx) => (
              <span key={idx} className="align-middle">
                <span className="mx-12 text-7xl font-extrabold text-white inline-block align-middle">
                  {skill}
                </span>
                <span className="mx-12 text-7xl font-extrabold text-yellow-400 align-middle">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Add marquee animation to index.css if not present
// .animate-marquee { animation: marquee 18s linear infinite; }
// @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }

const SocialBar = ({ hide }) => (
  <div className={`fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-8 z-30 bg-white bg-opacity-90 rounded-xl py-8 px-3 shadow-lg transition-all duration-500 ${hide ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`} id="social-bar">
    <a href="https://www.linkedin.com/in/oliveiradiogo1/" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-8 h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
    <a href="https://github.com/OliveiraDiogo1" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/github.png" alt="GitHub" className="w-8 h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full flex justify-end items-center px-10 py-6 z-30 bg-white-900 bg-opacity-90 backdrop-blur-md">
    <div className="flex space-x-8">
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Home</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">About</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Projects</button>
      <button className="font-bold text-white decoration-2 hover:text-yellow-400 transition bg-transparent border-none p-0 m-0 shadow-none focus:outline-none">Contact</button>
    </div>
  </nav>
);

const AboutSection = React.forwardRef((props, ref) => (
  <section
    ref={ref}
    style={{ backgroundColor: 'rgb(196, 143, 11)' }}
    className="w-full min-h-[60vh] flex flex-col items-center justify-center text-gray-900 py-24 px-4"
  >
    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6">About Me</h2>
    <p className="max-w-2xl text-center text-lg md:text-xl font-medium">
      I’m Diogo Oliveira, a passionate developer who loves building beautiful and functional web experiences. I enjoy working with modern technologies, learning new things, and collaborating with others to create impactful digital products. I’m always curious, always improving, and always ready for the next challenge.
    </p>
  </section>
));

function App() {
  const [hideSocialBar, setHideSocialBar] = useState(false);
  const aboutRef = useRef(null);
  const socialBarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutRect = aboutRef.current?.getBoundingClientRect();
      const socialBar = document.getElementById('social-bar');
      const socialRect = socialBar?.getBoundingClientRect();
      if (aboutRect && socialRect) {
        setHideSocialBar(socialRect.bottom > aboutRect.top);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SocialBar hide={hideSocialBar} ref={socialBarRef} />
      <Home />
      <AboutSection ref={aboutRef} />
      <SkillsSection />
    </div>
  );
}

export default App;
