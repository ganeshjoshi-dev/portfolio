"use client";

import { useState } from "react";
import brandTheme from "@/styles/brand-theme";
import { Button, Input, Select, Textarea } from "@/components/ui";

const inquiryOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "report-issue", label: "Report an Issue" },
  { value: "feature-request", label: "Feature Request" },
  { value: "project-discussion", label: "Project Discussion" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", inquiryType: "", message: "" });
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("IDLE");

    const res = await fetch("https://formspree.io/f/mgvzkgbr", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(e.target as HTMLFormElement),
    });

    const json = await res.json();
    if (json.ok) {
      setStatus("SUCCESS");
      setFormData({ name: "", email: "", inquiryType: "", message: "" });
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-lg p-8">
          <h1 className={`${brandTheme.components.text.hero} text-center mb-2`}>
            Contact <span className={brandTheme.components.logo.brand}>Me</span>
          </h1>
          <p className="text-slate-300 text-center mb-8 max-w-lg mx-auto">
            Have a project, question, or just want to say hi? Fill out the form
            below or connect with me on social media.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
            />

            <Select
              label="What can I help you with?"
              name="inquiryType"
              required
              value={formData.inquiryType}
              onChange={handleChange}
              placeholder="Select an option"
              options={inquiryOptions}
            />

            <Textarea
              label="Message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="How can I help you?"
            />

            {/* Honeypot for spam protection */}
            <input
              type="text"
              name="_gotcha"
              style={{ display: 'none' }}
              tabIndex={-1}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Send Message
            </Button>
          </form>

          {status === "SUCCESS" && (
            <p className="text-green-400 mt-4 text-center">Thanks! Your message has been sent.</p>
          )}
          {status === "ERROR" && (
            <p className="text-red-500 mt-4 text-center">Oops! Something went wrong. Please try again.</p>
          )}

          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="text-slate-400 text-sm">Or connect with me:</span>
            <div className="flex gap-4">
              <Button href="https://github.com/ganeshjoshi-gj" external variant="ghost" size="md">
                <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span>GitHub</span>
              </Button>
              <Button href="https://www.linkedin.com/in/joshiganesh" external variant="ghost" size="md">
                <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span>LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
