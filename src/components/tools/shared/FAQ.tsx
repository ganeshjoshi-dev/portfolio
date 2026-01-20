import Accordion from '@/components/ui/Accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  faqs: FAQItem[];
  includeSchema?: boolean;
}

export default function FAQ({ title = 'Frequently Asked Questions', faqs, includeSchema = true }: FAQProps) {
  const accordionItems = faqs.map((faq, index) => ({
    id: `faq-${index}`,
    title: faq.question,
    content: <p className="leading-relaxed">{faq.answer}</p>,
    defaultExpanded: false,
  }));

  // Generate FAQ schema for SEO (handled by tool-seo.ts, but we can add inline for specific cases)
  const faqSchema = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="space-y-6">
      {/* Schema markup - only if not already included in page head */}
      {faqSchema && includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      
      <Accordion items={accordionItems} allowMultiple={false} />
    </div>
  );
}
