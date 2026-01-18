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
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding text-center`}>
        <h1 className={`${brandTheme.components.text.hero} mb-4`}>
          Blog <span className={brandTheme.components.logo.brand}>Insights</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
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
