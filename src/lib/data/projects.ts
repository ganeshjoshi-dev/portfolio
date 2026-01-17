export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  images?: string[];
  technologies: string[];
  metrics?: string[];
  liveLink?: string;
  githubLink?: string;
  role: string;
  date: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "gadget-bazaar",
    slug: "gadget-bazaar",
    title: "Gadget Bazaar",
    description:
      "A full-featured ecommerce platform for electronics with modern UX, product discovery, and streamlined checkout.",
    fullDescription:
      "Gadget Bazaar is an ecommerce platform that allows customers to purchase a wide range of electronics products including TVs, smartphones, and more. The project focused on building a responsive shopping experience with fast product browsing and reliable order flows.",
    image: "/images/projects/gadgetbazaar.png",
    images: ["/images/projects/gadgetbazaar.png"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "MERN Stack"],
    metrics: [
      "Designed a scalable MERN architecture for ecommerce workflows",
      "Implemented product discovery and category browsing UX",
      "Focused on performance and responsive UI",
    ],
    githubLink: "https://github.com/GJ-MCA/Gadget-Bazaar",
    role: "Full Stack Developer",
    date: "2023-09",
    featured: true,
  },
  {
    id: "photostudioroom",
    slug: "photostudioroom",
    title: "Photostudioroom",
    description:
      "A platform for photoshoot booking and image sales, built with a focus on clean UX and reliable data flows.",
    fullDescription:
      "Photostudioroom enables users to book photoshoot appointments and purchase images from contributors. The build centered on structured data management and clear user flows for bookings and payments.",
    image: "/images/projects/photostudioroom.png",
    images: ["/images/projects/photostudioroom.png"],
    technologies: ["Python", "MySQL", "Web Development"],
    metrics: [
      "Built appointment booking workflow with structured data",
      "Implemented image catalog browsing and purchase flow",
      "Optimized database structure for faster queries",
    ],
    githubLink: "https://github.com/ganeshjoshi-gj/photostudioroom",
    role: "Full Stack Developer",
    date: "2021-06",
    featured: true,
  },
];
