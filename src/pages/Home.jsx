import { ui } from '../i18n/ui.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { About } from '../components/sections/About.jsx';
import { Experience } from '../components/sections/Experience.jsx';
import { Skills } from '../components/sections/Skills.jsx';
import { Projects } from '../components/sections/Projects.jsx';
import { ContactCta } from '../components/sections/ContactCta.jsx';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <Section id="about" title={t(ui.about.title)}>
        <About />
      </Section>
      <Section id="experience" title={t(ui.experience.title)}>
        <Experience />
      </Section>
      <Section id="skills" title={t(ui.skills.title)}>
        <Skills />
      </Section>
      <Section id="projects" title={t(ui.projects.title)}>
        <Projects />
      </Section>
      <ContactCta />
    </>
  );
}
