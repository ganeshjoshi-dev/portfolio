import type { Metadata } from 'next';
import brandTheme from '@/styles/brand-theme';
import ContactForm from '@/components/sections/ContactForm';
import { generatePageMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Ganesh Joshi | Hire a React Developer',
  description:
    'Get in touch for project discussions, collaborations, or inquiries. Full Stack Developer based in Ahmedabad, India specializing in Next.js and React.',
  path: '/contact',
  keywords: [
    'Contact Developer',
    'Hire React Developer',
    'Hire Next.js Developer',
    'Freelance Developer India',
    'Web Development Services',
    'Ahmedabad Developer',
  ],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-lg p-5 sm:p-8">
          <h1 className={`${brandTheme.components.text.hero} text-center mb-2`}>
            Contact <span className={brandTheme.components.logo.brand}>Me</span>
          </h1>
          <p className="text-slate-300 text-center mb-8 max-w-lg mx-auto">
            Have a project, question, or just want to say hi? Fill out the form
            below or connect with me on social media.
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
