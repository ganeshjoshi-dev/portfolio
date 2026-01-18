import type { Metadata } from "next";
import brandTheme from "@/styles/brand-theme";
import { Button } from "@/components/ui";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog | Ganesh Joshi - Developer Insights",
  description:
    "Articles and case studies on web development, performance optimization, UI engineering, and eCommerce experiences by Ganesh Joshi.",
  path: "/blog",
  keywords: [
    "Web Development Blog",
    "React Articles",
    "Next.js Tutorials",
    "Frontend Development",
    "Performance Optimization",
    "eCommerce Development",
  ],
});

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-20 sm:pt-24 pb-12 sm:pb-16">
      <section className={`${brandTheme.components.container.base} py-8 sm:py-12 text-center`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Blog <span className={brandTheme.components.logo.brand}>Insights</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8">
          Articles and case studies are coming soon. I&apos;ll share deep dives on
          performance, UI engineering, and ecommerce experiences.
        </p>
        <Button href="/" variant="secondary" size="lg">
          Back to Home
        </Button>
      </section>
    </main>
  );
}
