"use client";
import Link from "next/link";
import brandTheme from "@/styles/brand-theme";
import Image from "next/image";
import React from "react";
import ZoomImageModal from "@/app/components/ZoomImageModal";

export default function Home() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  return (
    <main className={`min-h-screen ${brandTheme.components.gradients.main} pt-20 pb-8`}> {/* pt-20 for navbar offset */}
      {/* Hero Section */}
      <section className={`flex flex-col items-center text-center ${brandTheme.spacing.section}`}>
        <h1 className={`${brandTheme.components.text.hero} mb-4`}>
          Ganesh <span className={brandTheme.components.logo.brand}>Joshi</span>
        </h1>
        <h2 className={`${brandTheme.components.text.title} mb-2 text-cyan-400`}>Full Stack Developer & Creative Problem Solver</h2>
        <p className={`${brandTheme.components.text.body} text-gray-300 max-w-2xl mb-6`}>Building scalable, beautiful web experiences with code and creativity. Passionate about modern frontend, eCommerce, and user-centric design.</p>
        <div className="flex gap-4 justify-center mb-8">
          <Link href="/projects" className={brandTheme.components.button.base}>View Projects</Link>
          <Link href="/contact" className={brandTheme.components.button.base}>Contact Me</Link>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white`}>
        <ZoomImageModal imageSrc={selectedImage || ''} open={!!selectedImage} onClose={() => setSelectedImage(null)} />
        <h3 className={`${brandTheme.components.text.title} text-center mb-6`}>Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Example project cards, update with real data/images */}
          <div className={brandTheme.components.card.base}>
            <div className="mb-3 rounded-lg overflow-hidden bg-gray-900 cursor-zoom-in group relative" onClick={() => setSelectedImage("/images/projects/gadgetbazaar.png")}>
              <Image src="/images/projects/gadgetbazaar.png" alt="Gadget Bazaar" width={400} height={200} className="object-cover object-top w-full h-40 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            <h4 className={`${brandTheme.components.text.title} mb-1`}>Gadget Bazaar</h4>
            <p className="text-gray-400 text-sm mb-2">Ecommerce platform for electronics</p>
            <p className="text-gray-300 text-sm mb-2">MERN Stack, React.js, Node.js</p>
            <Link href="/projects" className="text-cyan-400 underline text-sm">See Details</Link>
          </div>
          <div className={brandTheme.components.card.base}>
            <div className="mb-3 rounded-lg overflow-hidden bg-gray-900 cursor-zoom-in group relative" onClick={() => setSelectedImage("/images/projects/photostudioroom.png")}>
              <Image src="/images/projects/photostudioroom.png" alt="Photostudioroom" width={400} height={200} className="object-cover object-top w-full h-40 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            <h4 className={`${brandTheme.components.text.title} mb-1`}>Photostudioroom</h4>
            <p className="text-gray-400 text-sm mb-2">Photoshoot booking & image sales</p>
            <p className="text-gray-300 text-sm mb-2">MySQL, Python, Web Development</p>
            <Link href="/projects" className="text-cyan-400 underline text-sm">See Details</Link>
          </div>
        </div>
        <div className="text-center">
          <Link href="/projects" className={brandTheme.components.button.base}>See All Projects</Link>
        </div>
      </section>

      {/* About Preview */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white text-center`}>
        <h3 className={`${brandTheme.components.text.title} mb-4`}>About Me</h3>
        <p className={`${brandTheme.components.text.body} text-gray-300 max-w-2xl mx-auto mb-4`}>{`Hi! I'm Ganesh Joshi, a developer with a passion for clean code, modern web tech, and user-first design. With experience in eCommerce, full stack, and frontend, I love building things that matter.`}</p>
        <Link href="/about" className={brandTheme.components.button.base}>Discover My Full Story &amp; Experience</Link>
      </section>

      {/* Skills Snapshot */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white text-center`}>
        <h3 className={`${brandTheme.components.text.title} mb-4`}>Skills</h3>
        <div className="flex flex-wrap gap-3 justify-center mb-2">
          {['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'MERN Stack', 'NestJS', 'Adobe Commerce', 'eCommerce', 'Performance Optimization'].map(skill => (
            <span key={skill} className="px-4 py-2 bg-gray-800/50 text-cyan-400 rounded-full border border-cyan-400/20 text-sm font-medium">{skill}</span>
          ))}
        </div>
      </section>

      {/* Connect Section */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white text-center`}>
        <h3 className={`${brandTheme.components.text.title} mb-4`}>Let&apos;s Connect</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <a href="https://github.com/ganeshjoshi-gj" target="_blank" rel="noopener noreferrer" className={brandTheme.components.button.base}>
            <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/joshiganesh" target="_blank" rel="noopener noreferrer" className={brandTheme.components.button.base}>
            <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </section>
    </main>
  );
} 