import Image from "next/image";
import brandTheme from "@/styles/brand-theme";
import { personal } from "@/lib/data/personal";

const experience = [
  {
    title: "Frontend Developer",
    company: "Kitchen365",
    timeline: "Apr 2023 - Present",
    description:
      "Building modern web products with Next.js and React, focusing on performance, scalability, and polished user experiences.",
  },
  {
    title: "Frontend Developer",
    company: "Commerce Pundit",
    timeline: "Nov 2021 - Apr 2023",
    description:
      "Delivered Magento Commerce storefronts and optimized ecommerce UX for conversion and performance.",
  },
  {
    title: "Trainee Frontend Developer",
    company: "Commerce Pundit",
    timeline: "Aug 2021 - Oct 2021",
    description:
      "Started professional journey by implementing frontend best practices and working on ecommerce interfaces.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] items-start">
          <div className="flex justify-center lg:justify-start">
            <div className="h-48 w-48 rounded-full border border-cyan-400/60 p-1 shadow-[0_0_30px_rgba(0,217,255,0.25)]">
              <div className="h-full w-full rounded-full overflow-hidden bg-slate-900/60">
                <Image
                  src="/images/about/ganesh_joshi.jpeg"
                  alt="Ganesh Joshi"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className={`${brandTheme.components.text.hero} mb-4`}>
              About <span className={brandTheme.components.logo.brand}>Me</span>
            </h1>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              {personal.narrative}
            </p>
          </div>
        </div>
      </section>

      <section className={`${brandTheme.components.container.base} section-padding`}>
        <h2 className={`${brandTheme.components.text.title} mb-6`}>
          What I <span className={brandTheme.components.logo.brand}>Focus</span> On
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {personal.highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-slate-300">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${brandTheme.components.container.base} section-padding`}>
        <h2 className={`${brandTheme.components.text.title} mb-6`}>
          Professional <span className={brandTheme.components.logo.brand}>Journey</span>
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {experience.map((role) => (
            <div
              key={`${role.company}-${role.title}`}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6"
            >
              <h3 className="text-lg font-semibold text-white">
                {role.title}
              </h3>
              <p className="text-sm text-cyan-200">{role.company}</p>
              <p className="text-xs text-slate-400 mt-1">{role.timeline}</p>
              <p className="text-sm text-slate-300 mt-4">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}