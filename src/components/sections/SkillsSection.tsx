"use client";

import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { skills } from "@/lib/data/skills";
import { useReducedMotion } from "@/hooks";
import { RevealWrapper } from "@/components/animations";
import {
  fadeInUp,
  staggerContainer,
  staggerContainerFast,
  durations,
  easings,
} from "@/lib/animations";

const categories = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "design", label: "Design" },
  { key: "tools", label: "Tools" },
] as const;

export default function SkillsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative">
      <div className={`${brandTheme.components.container.base} section-padding`}>
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-8"
        >
          <motion.h2
            variants={fadeInUp}
            className={`${brandTheme.components.text.title} mb-3`}
          >
            Skills & <span className={brandTheme.components.logo.brand}>Tech Stack</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-300 max-w-2xl mx-auto"
          >
            Modern technologies and tools I use to build fast, reliable, and
            user-focused digital products.
          </motion.p>
        </motion.div>

        {/* Skills Grid with Staggered Animation */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainerFast}
              className="space-y-4"
            >
              <RevealWrapper delay={categoryIndex * 0.1}>
                <h3 className="text-lg font-semibold text-cyan-200">
                  {category.label}
                </h3>
              </RevealWrapper>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skills[category.key].map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    variants={{
                      hidden: { opacity: 0, y: 16, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: reduceMotion ? 0 : durations.fast,
                          delay: reduceMotion ? 0 : skillIndex * 0.05,
                          ease: easings.smooth,
                        },
                      },
                    }}
                    whileHover={
                      reduceMotion
                        ? {}
                        : {
                            y: -4,
                            borderColor: "rgba(0, 217, 255, 0.4)",
                            transition: { duration: durations.fast },
                          }
                    }
                    className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 text-center text-sm text-slate-200 cursor-default hover:text-cyan-200 transition-colors"
                  >
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
