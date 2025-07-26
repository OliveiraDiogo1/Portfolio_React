import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Skills from "./pages/Skills";

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

const experienceData = [
  {
    id: 100,
    date: "Oct 2024 – Present",
    role: "Junior Software Developer",
    company: "Sistrade - Software Consulting S.A.",
    description: "Modernized ERP features with Vue.js and .NET/C#, upgraded legacy ASP/ASPX screens, improved UI responsiveness, optimized SQL Server performance, built APIs for real-time factory data and event logging and co-advised an intern.",
    technologies: ["Vue.js", ".NET/C#", "ASP/ASPX", "MS SQL Server", "API", "JavaScript", "Python", "Kubernetes", "Docker"],
    logo: "/assets/icons/sistrade.png"
  },
  {
    id: 101,
    date: "Jul 2024 – Nov 2024",
    role: "Intern - Software Developer",
    company: "Sistrade - Software Consulting S.A.",
    description: "Built a Vue.js form and backend logic for employee position management, designed database schemas and integrated with MS SQL Server.",
    technologies: ["Vue.js", ".NET/C#", "MS SQL Server"],
    logo: "/assets/icons/sistrade.png"
  }
];

const ExperienceSection = React.memo(() => {
  const experienceItems = useMemo(() => 
    experienceData.map((exp) => (
      <div key={exp.id} className="relative flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-8 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl hover:shadow-gray-600/30 transition-all duration-300">
        <div className="w-full lg:w-[30%] flex-shrink-0 flex items-start">
          <div className="text-yellow-400 font-bold text-lg sm:text-xl tracking-wide">
            {exp.date}
          </div>
        </div>
        
        <div className="w-full lg:w-[40%] flex-shrink-0 flex flex-col justify-center">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">
                {exp.role}
              </h3>
              <p className="text-red-400 font-semibold text-lg sm:text-xl hover:text-cyan-200 transition-colors">
                {exp.company}
              </p>
            </div>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {exp.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-yellow-400/20 text-yellow-300 text-sm sm:text-base rounded-full border border-yellow-400/30 hover:bg-yellow-400/30 hover:border-yellow-400/50 hover:text-yellow-200 hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="absolute top-6 right-6 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-800 rounded-2xl flex items-center justify-center p-4 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <img
              src={exp.logo}
              alt={`${exp.company} logo`}
              className="w-full h-full object-contain filter brightness-110 contrast-110"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-6 lg:hidden">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-800 rounded-2xl flex items-center justify-center p-4 border border-gray-700 shadow-xl overflow-hidden">
            <img
              src={exp.logo}
              alt={`${exp.company} logo`}
              className="w-full h-full object-contain filter brightness-110 contrast-110"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    )), []);

  return (
    <section 
      className="w-full flex flex-col items-center justify-center min-h-[60vh] py-12 sm:py-16"
      style={{ backgroundColor: '#FDE048' }}
    >
      <div className="w-[95vw] max-w-[1800px] bg-transparent rounded-3xl overflow-hidden flex flex-col items-center justify-start">
        <h2 className="text-[6vw] sm:text-[8vw] font-extrabold text-gray-900 text-center mt-0 mb-8 sm:mb-12 tracking-widest leading-none">EXPERIENCE</h2>
        <div className="w-full max-w-7xl space-y-10">
          {experienceItems}
        </div>
      </div>
    </section>
  );
});

const SkillsSection = React.memo(() => {
  const repeatedSkills = useMemo(() => [...skills, ...skills, ...skills, ...skills, ...skills, ...skills], []);
  
  const skillItems = useMemo(() => 
    repeatedSkills.map((skill, idx) => (
      <span key={idx} className="align-middle">
        <span className="mx-6 sm:mx-12 text-3xl sm:text-7xl font-extrabold text-white inline-block align-middle">
          {skill}
        </span>
        <span className="mx-6 sm:mx-12 text-3xl sm:text-7xl font-extrabold text-yellow-400 align-middle">|</span>
      </span>
    )), [repeatedSkills]);

  return (
    <section className="w-full flex flex-col items-center justify-center bg-black min-h-[50vh] py-8 sm:py-12">
      <div className="w-[95vw] max-w-[1800px] bg-black rounded-3xl overflow-hidden flex flex-col items-center justify-start">
        <h2 className="text-[6vw] sm:text-[8vw] font-extrabold text-white text-center mt-0 mb-4 sm:mb-8 tracking-widest leading-none">SKILLS</h2>
        <div className="overflow-hidden w-full flex items-center justify-center" style={{ height: '4rem sm:8rem' }}>
          <div className="marquee-container">
            <div className="marquee-content">
              {skillItems}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link to="/skills" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-200">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
});

const SocialBar = React.memo(({ hide }) => (
  <div className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 sm:space-y-8 z-30 bg-white bg-opacity-90 rounded-xl py-4 sm:py-8 px-2 sm:px-3 shadow-lg transition-all duration-500 ${hide ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'} hidden sm:flex`} id="social-bar">
    <a href="https://www.linkedin.com/in/oliveiradiogo1/" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" loading="lazy" />
    </a>
    <a href="https://github.com/OliveiraDiogo1" target="_blank" rel="noopener noreferrer" className="group">
      <img src="/assets/icons/github.png" alt="GitHub" className="w-6 h-6 sm:w-8 sm:h-8 transition group-hover:filter group-hover:brightness-150 group-hover:saturate-200 group-hover:drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" loading="lazy" />
    </a>
  </div>
));

const Navbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 md:px-10 py-2 z-30 bg-white bg-opacity-80 backdrop-blur-md shadow-lg transition-all">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center">
            <img src="/assets/dev-icon.png" alt="Logo" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <HashLink smooth to="/#home" onClick={closeMenu} className="font-ubuntu text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-wide hover:text-yellow-500 transition-colors">Diogo Oliveira</HashLink>
        </div>
        
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
      
      <div className="hidden sm:flex flex-wrap justify-center sm:flex-row gap-2 sm:gap-4 md:gap-8 items-center w-full sm:w-auto">
        <HashLink smooth to="/#home" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">Home</HashLink>
        <HashLink smooth to="/#about" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">About</HashLink>
        <Link to="/skills" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">Skills</Link>
        <HashLink smooth to="/#experience" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base">Experience</HashLink>
        <Link to="/contact" onClick={closeMenu} className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-200">Contact</Link>
      </div>
      
      <div className={`sm:hidden w-full ${isMenuOpen ? 'block' : 'hidden'} bg-white bg-opacity-95 backdrop-blur-md rounded-lg mt-2 shadow-lg`}>
        <div className="flex flex-col gap-1 p-4">
          <HashLink smooth to="/#home" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">Home</HashLink>
          <HashLink smooth to="/#about" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">About</HashLink>
          <Link to="/skills" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">Skills</Link>
          <HashLink smooth to="/#experience" onClick={closeMenu} className="font-bold text-gray-900 hover:text-yellow-500 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base">Experience</HashLink>
          <Link to="/contact" onClick={closeMenu} className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold px-3 py-2 rounded-full shadow transition-all text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 text-center">Contact</Link>
        </div>
      </div>
    </nav>
  );
});

const AboutSection = React.memo(React.forwardRef((props, ref) => (
  <section
    ref={ref}
    style={{ backgroundColor: '#FDE048' }}
    className="w-full min-h-[60vh] flex flex-col items-center justify-center text-gray-900 py-16 sm:py-20 md:py-24 px-4 sm:px-6"
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 sm:mb-6">About Me</h2>
    <p className="max-w-2xl text-center text-base sm:text-lg md:text-xl font-medium px-4">
    I'm Diogo Oliveira. I build clean, efficient and user-focused web applications. I work with modern technologies and write code that solves real problems. I keep learning and pushing my skills. I don’t avoid challenges. I enjoy both front-end and back-end work. I care about building things that work well and working with people who take the craft seriously.    </p>
  </section>
)));

function App() {
  const [hideSocialBar, setHideSocialBar] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutRect = aboutRef.current?.getBoundingClientRect();
      const socialBar = document.getElementById('social-bar');
      const socialRect = socialBar?.getBoundingClientRect();
      if (aboutRect && socialRect) {
        setHideSocialBar(socialRect.bottom > aboutRect.top);
      }
    };
    
    const throttledHandleScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar />
        <SocialBar hide={hideSocialBar} />
        <Routes>
          <Route path="/" element={
            <>
              <div id="home">
                <Home />
              </div>
              <div id="about">
                <AboutSection ref={aboutRef} />
              </div>
              <div id="skills">
                <SkillsSection />
              </div>
              <div id="experience">
                <ExperienceSection />
              </div>
            </>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </div>
    </Router>
  );
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export default App;
