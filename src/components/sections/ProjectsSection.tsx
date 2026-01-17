"use client";

import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { projects } from "@/lib/data/projects";
import { ProjectCard, Button } from "@/components/ui";
import { MagneticWrapper } from "@/components/animations";
import {
  fadeInUp,
  staggerContainer,
  durations,
  easings,
} from "@/lib/animations";
import { useReducedMotion } from "@/hooks";

export default function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className="relative">
      <div className={`${brandTheme.components.container.base} section-padding`}>
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.h2
            variants={fadeInUp}
            className={`${brandTheme.components.text.title} mb-3`}
          >
            Featured <span className={brandTheme.components.logo.brand}>Projects</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-300 max-w-2xl"
          >
            A curated selection of work that highlights my focus on scalable
            architecture, modern UI, and measurable outcomes.
          </motion.p>
        </motion.div>

        {/* Projects Grid with Staggered Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.15,
              },
            },
          }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reduceMotion ? 0 : durations.slow,
                    ease: easings.easeOutQuart,
                  },
                },
              }}
            >
              <ProjectCard {...project} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : durations.normal,
            delay: reduceMotion ? 0 : 0.3,
            ease: easings.smooth,
          }}
          className="mt-10 text-center"
        >
          <MagneticWrapper strength={0.15}>
            <Button href="/projects" variant="secondary" size="lg">
              View All Projects
            </Button>
          </MagneticWrapper>
        </motion.div>
      </div>
    </section>
  );
}
