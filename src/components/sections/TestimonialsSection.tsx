"use client";

import { motion } from "framer-motion";
import brandTheme from "@/styles/brand-theme";
import { testimonials } from "@/lib/data/testimonials";
import { useReducedMotion } from "@/hooks";
import { TiltWrapper } from "@/components/animations";
import {
  fadeInUp,
  staggerContainer,
  durations,
  easings,
} from "@/lib/animations";

export default function TestimonialsSection() {
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
          className="text-center mb-10"
        >
          <motion.h2
            variants={fadeInUp}
            className={`${brandTheme.components.text.title} mb-3`}
          >
            What People <span className={brandTheme.components.logo.brand}>Say</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-300 max-w-2xl mx-auto"
          >
            A few words from people I have worked with. Real testimonials will
            be updated as new collaborations come in.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: reduceMotion ? 0 : durations.slow,
                    ease: easings.easeOutQuart,
                  },
                },
              }}
            >
              <TiltWrapper maxTilt={5} scale={1.01}>
                <div className="h-full rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.1)]">
                  {/* Accent bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: reduceMotion ? 0 : durations.slow,
                      delay: reduceMotion ? 0 : index * 0.1,
                      ease: easings.easeOutExpo,
                    }}
                    className="h-1 w-12 bg-cyan-400/70 mb-4 rounded-full origin-left"
                  />

                  {/* Quote */}
                  <p className="text-sm text-slate-200 italic mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-slate-400">
                      {testimonial.role}
                      {testimonial.company ? ` · ${testimonial.company}` : ""}
                    </p>
                  </div>
                </div>
              </TiltWrapper>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
