/**
 * Reserved for a future testimonials section. Currently unused (TestimonialsSection was removed).
 */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

/**
 * Set to true when real testimonials are available
 * When false, the testimonials section will show a placeholder message
 */
export const hasRealTestimonials = false;

/**
 * Testimonials data
 * Replace placeholder content with real testimonials when available
 * and set hasRealTestimonials to true
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Ganesh delivers clean, reliable frontend experiences and consistently focuses on performance and UX details.",
    author: "Available Soon",
    role: "Product Owner",
    company: "Company",
  },
  {
    quote:
      "Strong communicator with a sharp eye for user-first design. Projects were delivered on time with excellent quality.",
    author: "Available Soon",
    role: "Engineering Lead",
    company: "Team",
  },
  {
    quote:
      "Professional and proactive. The build quality and attention to detail were top-notch throughout the project.",
    author: "Available Soon",
    role: "Project Manager",
    company: "Company",
  },
];
