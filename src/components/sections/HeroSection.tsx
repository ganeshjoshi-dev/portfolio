"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { useReducedMotion } from "@/hooks";
import {
  AnimatedBackground,
  ScrollIndicator,
  SplitText,
  MagneticWrapper,
} from "@/components/animations";
import { Button } from "@/components/ui";
import { staggerContainerSlow, fadeInUp } from "@/lib/animations";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className={`${brandTheme.components.container.base} relative z-10`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerSlow}
          className="min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-16"
        >
          {/* Profile Image */}
          <motion.div
            variants={fadeInUp}
            className="relative mb-8"
          >
            <motion.div
              animate={reduceMotion ? {} : { scale: [1, 1.05, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full blur-2xl bg-cyan-400/20"
            />
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-full border-2 border-cyan-400/60 p-1 shadow-[0_0_30px_rgba(0,217,255,0.25)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-slate-900/60">
                <Image
                  src="/images/about/ganesh_joshi.jpeg"
                  alt="Ganesh Joshi"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Name with Split Text Animation */}
          <motion.h1
            variants={fadeInUp}
            className={`${brandTheme.components.text.hero} mb-4`}
          >
            <SplitText type="chars" stagger={0.04} delay={0.2}>
              Ganesh
            </SplitText>{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              <SplitText type="chars" stagger={0.04} delay={0.5}>
                Joshi
              </SplitText>
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-cyan-300 text-lg sm:text-xl font-semibold mb-4"
          >
            <SplitText type="words" stagger={0.1} delay={0.8}>
              Full Stack Developer & Creative Problem Solver
            </SplitText>
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className={`${brandTheme.components.text.body} text-gray-300 max-w-2xl mb-8`}
          >
            I build high-performing web experiences with a focus on clean
            architecture, modern UI, and measurable impact. Specialized in
            eCommerce, Next.js, and scalable frontend systems.
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticWrapper strength={0.2}>
              <Button href="/projects" variant="primary" size="lg">
                View My Work
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button href="/contact" variant="secondary" size="lg">
                Get In Touch
              </Button>
            </MagneticWrapper>
          </motion.div>

          {/* Scroll Indicator */}
          <div className="mt-8 sm:mt-12">
            <ScrollIndicator />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
