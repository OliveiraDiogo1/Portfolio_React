import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import Home from "./pages/Home";
import Contact from "./pages/Contact";

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
    <section className="w-full flex flex-col items-center justify-center bg-black min-h-[50vh] py-8 sm:py-12">
      <div className="w-[95vw] max-w-[1800px] bg-black rounded-3xl overflow-hidden flex flex-col items-center justify-start">
        <h2 className="text-[6vw] sm:text-[8vw] font-extrabold text-white text-center mt-0 mb-4 sm:mb-8 tracking-widest leading-none">SKILLS</h2>
        <div className="overflow-hidden w-full flex items-center justify-center" style={{ height: '4rem sm:8rem' }}>
          <div className="inline-block animate-marquee-slow whitespace-nowrap align-middle">
            {repeatedSkills.map((skill, idx) => (
              <span key={idx} className="align-middle">
                <span className="mx-6 sm:mx-12 text-3xl sm:text-7xl font-extrabold text-white inline-block align-middle">
                  {skill}
                </span>
                <span className="mx-6 sm:mx-12 text-3xl sm:text-7xl font-extrabold text-yellow-400 align-middle">|</span>
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
  <div className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 sm:space-y-8 z-30 bg-white bg-opacity-90 rounded-xl py-4 sm:py-8 px-2 sm:px-3 shadow-lg transition-all duration-500 ${hide ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'} hidden sm:flex`} id="social-bar">
    <a href="https://www.linkedin.com/in/oliveiradiogo1/" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
    <a href="https://github.com/OliveiraDiogo1" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/github.png" alt="GitHub" className="w-6 h-6 sm:w-8 sm:h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
    </a>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 md:px-10 py-2 z-30 bg-white bg-opacity-80 backdrop-blur-md shadow-lg transition-all">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center">
            <img src="/assets/dev-icon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-ubuntu text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-wide">Diogo Oliveira</span>
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden sm:flex flex-wrap justify-center sm:flex-row gap-2 sm:gap-4 md:gap-8 items-center w-full sm:w-auto">
        <HashLink smooth to="/#home" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">Home</HashLink>
        <HashLink smooth to="/#about" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">About</HashLink>
        <HashLink smooth to="/#projects" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">Skills</HashLink>
        <Link to="/contact" onClick={closeMenu} className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-200">Contact</Link>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden w-full ${isMenuOpen ? 'block' : 'hidden'} bg-white bg-opacity-95 backdrop-blur-md rounded-lg mt-2 shadow-lg`}>
        <div className="flex flex-col gap-1 p-4">
          <HashLink smooth to="/#home" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">Home</HashLink>
          <HashLink smooth to="/#about" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">About</HashLink>
          <HashLink smooth to="/#projects" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">Skills</HashLink>
          <Link to="/contact" onClick={closeMenu} className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold px-3 py-2 rounded-full shadow transition-all text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 text-center">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

const AboutSection = React.forwardRef((props, ref) => (
  <section
    ref={ref}
    style={{ backgroundColor: 'rgb(196, 143, 11)' }}
    className="w-full min-h-[60vh] flex flex-col items-center justify-center text-gray-900 py-16 sm:py-20 md:py-24 px-4 sm:px-6"
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 sm:mb-6">About Me</h2>
    <p className="max-w-2xl text-center text-base sm:text-lg md:text-xl font-medium px-4">
      I'm Diogo Oliveira, a passionate developer who loves building beautiful and functional web experiences. I enjoy working with modern technologies, learning new things, and collaborating with others to create impactful digital products. I'm always curious, always improving, and always ready for the next challenge.
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
    <Router>
      <div className="relative min-h-screen">
        <Navbar />
        <SocialBar hide={hideSocialBar} ref={socialBarRef} />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <div id="about">
                <AboutSection ref={aboutRef} />
              </div>
              <div id="projects">
                {/* Projects section will be added here */}
              </div>
              <SkillsSection />
            </>
          } />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
