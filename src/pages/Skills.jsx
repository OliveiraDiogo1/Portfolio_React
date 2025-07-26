import React from "react";

const skillsData = [
  {
    title: "Front-end",
    description: "I build interactive and modern UIs using the latest frameworks and tools.",
    highlights: [
      { label: "Languages I use:", value: "JavaScript, TypeScript, HTML, CSS, Sass" },
      { label: "Frameworks:", value: "React, Vue.js" },
      { label: "UI Libraries:", value: "Bootstrap, Bulma" },
      { label: "Dev Tools:", value: "Vite, Figma, Git" },
    ],
    icon: "/assets/icons/front-end.png",
  },
  {
    title: "Back-end & DB",
    description: "I design robust backends and manage data with scalable solutions.",
    highlights: [
      { label: "Languages I use:", value: "Python, C#, SQL" },
      { label: "Frameworks:", value: ".NET, ASP/ASPX" },
      { label: "Databases:", value: "MS SQL Server" },
      { label: "Dev Tools:", value: "Bitbucket, API design" },
    ],
    icon: "/assets/icons/back-end-db.png",
  },
  {
    title: "DevOps",
    description: "I automate, deploy, and monitor applications for reliability and scale.",
    highlights: [
      { label: "Tools I use:", value: "Docker, Kubernetes, Git" },
      { label: "CI/CD:", value: "Bitbucket Pipelines" },
      { label: "Cloud/Infra:", value: "Linux, Scripting" },
    ],
    icon: "/assets/icons/dev-ops.png",
  },
];

const Skills = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 relative overflow-hidden py-12">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-tr from-blue-500/10 via-purple-700/10 to-pink-500/10" />
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <h1 className="text-[6vw] sm:text-[8vw] font-extrabold text-white text-center mb-12 tracking-widest leading-none">SKILLS</h1>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 justify-center items-stretch px-4">
          {skillsData.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="flex-1 bg-black/60 backdrop-blur-lg border border-zinc-700 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-yellow-400/20 transition-all"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                  <img
                    src={pillar.icon}
                    alt={pillar.title + " icon"}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">{pillar.title}</h2>
              <p className="text-gray-200 mb-4">{pillar.description}</p>
              <div className="text-left w-full mt-4">
                {pillar.highlights.map((item, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-purple-400 font-semibold">{item.label} </span>
                    <span className="text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills; 