"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { TiltWrapper, MagneticWrapper } from "@/components/animations";
import { durations } from "@/lib/animations";
import Button from "./Button";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  metrics?: string[];
  liveLink?: string;
  githubLink?: string;
  featured?: boolean;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  technologies,
  metrics,
  liveLink,
  githubLink,
  featured,
}: ProjectCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <TiltWrapper maxTilt={6} scale={1.01}>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm shadow-lg h-full transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Featured Badge */}
          {featured && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: durations.fast }}
              className="absolute left-4 top-4 rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200 border border-cyan-400/30 backdrop-blur-sm"
            >
              Featured
            </motion.span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div>
            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>

          {/* Tech Stack with staggered animation */}
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, techIndex) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: reduceMotion ? 0 : durations.fast,
                  delay: reduceMotion ? 0 : techIndex * 0.05,
                }}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 transition-all duration-200 hover:bg-cyan-400/20 hover:border-cyan-400/50"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Metrics */}
          {metrics && metrics.length > 0 && (
            <ul className="space-y-2 text-sm text-slate-300">
              {metrics.map((metric, metricIndex) => (
                <motion.li
                  key={metric}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduceMotion ? 0 : durations.fast,
                    delay: reduceMotion ? 0 : metricIndex * 0.1,
                  }}
                  className="flex items-start gap-2"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>{metric}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {liveLink && (
              <MagneticWrapper strength={0.15}>
                <Button href={liveLink} external variant="primary" size="md">
                  View Live
                </Button>
              </MagneticWrapper>
            )}
            {githubLink && (
              <MagneticWrapper strength={0.15}>
                <Button href={githubLink} external variant="secondary" size="md">
                  GitHub
                </Button>
              </MagneticWrapper>
            )}
          </div>
        </div>
      </article>
    </TiltWrapper>
  );
}
