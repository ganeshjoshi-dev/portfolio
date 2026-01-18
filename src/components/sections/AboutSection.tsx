"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { personal } from "@/lib/data/personal";
import { useReducedMotion } from "@/hooks";
import { MagneticWrapper, TiltWrapper } from "@/components/animations";
import {
  fadeInUp,
  fadeInLeft,
  staggerContainer,
  durations,
  easings,
} from "@/lib/animations";

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative">
      <div className={`${brandTheme.components.container.base} section-padding`}>
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-2 items-start">
          {/* Left Column - Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInLeft}
              className={`${brandTheme.components.text.title} mb-4`}
            >
              About <span className={brandTheme.components.logo.brand}>Me</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 leading-relaxed"
            >
              {personal.narrative}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <MagneticWrapper strength={0.1}>
                <Link
                  href="/about"
                  className="mt-6 inline-flex items-center text-cyan-300 hover:text-cyan-200 transition-colors group"
                >
                  Discover My Full Story{" "}
                  <motion.span
                    className="inline-block ml-1"
                    animate={reduceMotion ? {} : { x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </Link>
              </MagneticWrapper>
            </motion.div>
          </motion.div>

          {/* Right Column - Highlight Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.12,
                },
              },
            }}
            className="space-y-6"
          >
            {personal.highlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: reduceMotion ? 0 : durations.slow,
                      ease: easings.easeOutQuart,
                    },
                  },
                }}
              >
                <TiltWrapper maxTilt={4} scale={1.01}>
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.1)]">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {highlight.description}
                    </p>
                  </div>
                </TiltWrapper>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
