export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ganesh delivers clean, reliable frontend experiences and consistently focuses on performance and UX details.",
    author: "Client Name",
    role: "Product Owner",
    company: "Company Name",
  },
  {
    quote:
      "Strong communicator with a sharp eye for user-first design. Projects were delivered on time with excellent quality.",
    author: "Colleague Name",
    role: "Engineering Lead",
    company: "Team Name",
  },
  {
    quote:
      "Professional and proactive. The build quality and attention to detail were top-notch throughout the project.",
    author: "Manager Name",
    role: "Project Manager",
    company: "Company Name",
  },
];
