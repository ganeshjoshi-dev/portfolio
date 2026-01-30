import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import CTASection from "@/components/sections/CTASection";
import { siteConfig, generatePageMetadata } from "@/lib/utils/seo";

export const metadata = generatePageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function Page() {
  return (
    <main id="top" className="bg-[#0a0e27] text-white">
      <HeroSection />
      <section id="about">
        <AboutSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="skills">
        <SkillsSection />
      </section>
      <section id="contact">
        <CTASection />
      </section>
    </main>
  );
}