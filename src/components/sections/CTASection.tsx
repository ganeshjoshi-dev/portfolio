"use client";

import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { useReducedMotion } from "@/hooks";
import { MagneticWrapper } from "@/components/animations";
import { Button } from "@/components/ui";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative">
      <div className={`${brandTheme.components.container.base} section-padding`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="relative rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-cyan-400/10 p-6 sm:p-10 text-center shadow-lg overflow-hidden"
        >
          {/* Background glow effect */}
          <motion.div
            animate={reduceMotion ? {} : { opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={reduceMotion ? {} : { opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"
          />

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10"
          >
            Ready to build something amazing?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-300 max-w-2xl mx-auto mb-8 relative z-10"
          >
            Let&apos;s collaborate on your next web experience. I bring a blend of
            technical depth and user-first design to every project.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
          >
            <MagneticWrapper strength={0.2}>
              <Button href="/contact" variant="primary" size="lg">
                Get In Touch
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button href="/projects" variant="secondary" size="lg">
                View Projects
              </Button>
            </MagneticWrapper>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
