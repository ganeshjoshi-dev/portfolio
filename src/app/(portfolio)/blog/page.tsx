import brandTheme from "@/styles/brand-theme";
import { Button } from "@/components/ui";

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
