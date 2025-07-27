"use client";

import React, { useState } from "react";
import Image from "next/image";
import brandTheme from "@/styles/brand-theme";
import ZoomImageModal from "@/app/components/ZoomImageModal";

export default function ProjectsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    {
      title: "Gadget Bazaar",
      period: "Jan 2023 - Sep 2023",
      association: "Gujarat Technological University, Ahmedabad",
      description: "Gadget Bazaar is an ecommerce platform that allows customers to purchase a wide range of electronics products including TVs, smartphones, washing machines, and more. It aims to provide an easy and convenient shopping experience for its customers.",
      skills: ["MERN Stack", "E-Commerce", "Web Development", "React.js", "Node.js"],
      githubUrl: "https://github.com/GJ-MCA/Gadget-Bazaar",
      image: "/images/projects/gadgetbazaar.png" // You'll need to add this image to your public folder
    },
    {
      title: "Photostudioroom",
      period: "Jan 2021 - Jun 2021",
      association: "Gujarat University",
      description: "Photostudioroom provides functionality that allows customers to book appointments for photoshoots by filling out a form on our website. Customers can also purchase images uploaded by our contributors from our website.",
      skills: ["MySQL", "Python", "Web Development", "Database Design"],
      githubUrl: "https://github.com/ganeshjoshi-gj/photostudioroom",
      image: "/images/projects/photostudioroom.png" // You'll need to add this image to your public folder
    }
  ];

  return (
    <div className={`min-h-screen ${brandTheme.components.gradients.main}`}>
      <ZoomImageModal imageSrc={selectedImage || ''} open={!!selectedImage} onClose={() => setSelectedImage(null)} />

      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white`}>
        <div className="flex flex-col items-center text-center">
          <h1 className={`${brandTheme.components.text.hero} mb-6`}>
            My <span className={brandTheme.components.logo.brand}>Projects</span>
          </h1>
          <p className={`${brandTheme.components.text.body} opacity-90 max-w-2xl mb-12`}>
            A showcase of my development journey, featuring projects that demonstrate my skills in 
            full-stack development, eCommerce solutions, and web applications.
          </p>
        </div>
      </section>

      <section className={`${brandTheme.spacing.section} ${brandTheme.components.container.base} text-white`}>
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`${brandTheme.components.card.base} overflow-hidden`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div 
                    className="relative h-48 lg:h-full rounded-lg overflow-hidden bg-gray-800 cursor-zoom-in group"
                    onClick={() => setSelectedImage(project.image)}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <h3 className={`${brandTheme.components.text.title} mb-2`}>
                    {project.title}
                  </h3>
                  <p className={`${brandTheme.components.text.small} text-gray-400 mb-3`}>
                    {project.period} • {project.association}
                  </p>
                  <p className={`${brandTheme.components.text.body} text-gray-300 mb-4`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-gray-800/50 text-cyan-400 rounded-full border border-cyan-400/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* GitHub Link */}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={brandTheme.components.button.base}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>View on GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
