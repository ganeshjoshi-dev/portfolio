"use client";

import { LINKEDIN_URL, GITHUB_URL } from "@/config/constants";
import React from "react";
import brandTheme from "@/styles/brand-theme";
import Image from "next/image";
export default function AboutPage() {
  return (
    <div className={`min-h-screen ${brandTheme.components.gradients.main} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/6 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white relative z-10`}>
        <div className="flex flex-col items-center text-center">
          {/* Profile Image Placeholder */}
          <div className="w-40 h-40 mb-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/30 flex items-center justify-center backdrop-blur-sm">
            <div className="w-34 h-34 rounded-full bg-gray-800/50 flex items-center justify-center">
             <Image src="/images/about/ganesh_joshi.jpeg" alt="Ganesh Joshi" width={136} height={136} className="rounded-full"/>
            </div>
          </div>

          <h1 className={`${brandTheme.components.text.hero} mb-6`}>
            About <span className={brandTheme.components.logo.brand}>Me</span>
          </h1>
          
          {/* Enhanced Badge */}
          <div className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/30 rounded-full backdrop-blur-sm">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
            <span className={`${brandTheme.components.text.title} ${brandTheme.components.logo.brand}`}>
              Adobe Certified Expert (ACE)
            </span>
          
          </div>

          <div className="max-w-4xl space-y-6">
            <p className={`${brandTheme.components.text.body} opacity-90 leading-relaxed`}>
              Hi there! 👋 I&apos;m <span className="text-cyan-400 font-semibold">Ganesh Joshi</span>, a frontend developer with a strong academic foundation in BCA and MCA. 
              My expertise spans from building high-performing eCommerce solutions with Adobe Commerce to crafting modern web applications 
              using Next.js and React.js. I bring a perfect blend of technical expertise and user-centric design thinking to every project.
            </p>
            <p className={`${brandTheme.components.text.body} opacity-90 leading-relaxed`}>
              With a strong eye for detail, a passion for clean, performant code, and a user-first mindset, 
              I love working on scalable solutions that balance both <span className="text-cyan-400">aesthetics</span> and <span className="text-cyan-400">functionality</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white relative z-10`}>
        <div className="text-center mb-12">
          <h2 className={`${brandTheme.components.text.title} mb-4`}>Technical Expertise</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-cyan-400/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className={`${brandTheme.components.text.title}`}>Frontend Expertise</h3>
              </div>
              <ul className={`${brandTheme.components.text.small} ${brandTheme.spacing.stack} text-gray-300`}>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  Next.js & React.js
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  Adobe Commerce (Magento)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  TypeScript & JavaScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  Modern Frontend Architecture
                </li>
              </ul>
            </div>
          </div>

          <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                  </svg>
                </div>
                <h3 className={`${brandTheme.components.text.title}`}>Full Stack Development</h3>
              </div>
              <ul className={`${brandTheme.components.text.small} ${brandTheme.spacing.stack} text-gray-300`}>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  MERN Stack
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  NestJS
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  RESTful APIs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  eCommerce Development
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Performance Optimization
                </li>
              </ul>
            </div>
          </div>

          <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className={`${brandTheme.components.text.title}`}>Education & Certification</h3>
              </div>
              <ul className={`${brandTheme.components.text.small} ${brandTheme.spacing.stack} text-gray-300`}>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Adobe Certified Expert (ACE)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  MCA - GTU (8.72 Grade)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  BCA - Gujarat University (8.49 Grade)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white relative z-10`}>
        <div className="text-center mb-12">
          <h2 className={`${brandTheme.components.text.title} mb-4`}>Professional Journey</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-emerald-400"></div>
            
            <div className="space-y-12">
              {/* Current Position */}
              <div className="relative flex items-center">
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-cyan-400 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="ml-16 md:ml-0 md:w-1/2 md:pr-8">
                  <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
                    <div className="absolute top-2 right-2 px-3 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded-full border border-cyan-400/30">
                      Current
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h3 className={`${brandTheme.components.text.title} mb-2 text-cyan-400 mt-6 sm:mt-0`}>Frontend Developer at Kitchen365</h3>
                      <p className={`${brandTheme.components.text.small} text-gray-400 mb-4`}>Apr 2023 - Present · Sister Concern Company of Commerce Pundit</p>
                      <p className={`${brandTheme.components.text.body} text-gray-300 leading-relaxed`}>
                        Working full-time on building modern web products using Next.js and React.js. 
                        Focusing on server-side rendering, modern frontend architecture, and delivering 
                        exceptional user experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Position */}
              <div className="relative flex items-center">
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-purple-400 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="ml-16 md:ml-0 md:w-1/2 md:ml-auto md:pl-8">
                  <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h3 className={`${brandTheme.components.text.title} mb-2 text-purple-400`}>Frontend Developer at Commerce Pundit</h3>
                      <p className={`${brandTheme.components.text.small} text-gray-400 mb-4`}>Nov 2021 - Apr 2023 · 1 yr 6 mos</p>
                      <p className={`${brandTheme.components.text.body} text-gray-300 leading-relaxed`}>
                        Specialized in Magento Commerce and Front-End Development, building user-centric 
                        and high-performing online stores. Focused on delivering seamless shopping experiences 
                        and optimizing eCommerce platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Starting Position */}
              <div className="relative flex items-center">
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="ml-16 md:ml-0 md:w-1/2 md:pr-8">
                  <div className={`${brandTheme.components.card.base} group relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h3 className={`${brandTheme.components.text.title} mb-2 text-emerald-400`}>Trainee Frontend Developer at Commerce Pundit</h3>
                      <p className={`${brandTheme.components.text.small} text-gray-400 mb-4`}>Aug 2021 - Oct 2021 · 3 mos</p>
                      <p className={`${brandTheme.components.text.body} text-gray-300 leading-relaxed`}>
                        Started my professional journey in frontend development, learning and implementing 
                        best practices in web development and eCommerce solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white text-center relative z-10`}>
        <div className="mb-12">
          <h2 className={`${brandTheme.components.text.title} mb-4`}>Let&apos;s Connect</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className={`${brandTheme.components.text.body} text-gray-300 max-w-2xl mx-auto`}>
            Ready to collaborate on your next project? Let&apos;s connect and create something amazing together!
          </p>
        </div>
        
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
        
        {/* Optional CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl backdrop-blur-sm">
          <p className={`${brandTheme.components.text.body} text-gray-300 mb-4`}>
            💡 <span className="text-cyan-400">Interested in working together?</span>
          </p>
          <p className={`${brandTheme.components.text.small} text-gray-400`}>
            I&apos;m always open to discussing new opportunities and interesting projects.
          </p>
        </div>
      </section>
    </div>
  );
}