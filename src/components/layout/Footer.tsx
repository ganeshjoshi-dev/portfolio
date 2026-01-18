import Link from "next/link";
import { GITHUB_URL, LINKEDIN_URL } from "@/config/constants";
import brandTheme from "@/styles/brand-theme";
import { Button } from "@/components/ui";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", href: "/#top" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-[#0a0e27] text-white border-t border-slate-700/60">
      <div className={`${brandTheme.components.container.base} py-12`}>
        <div className="grid gap-8 md:grid-cols-3 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">Let&apos;s Connect</h3>
            <p className="text-sm text-slate-300 mb-4">
              Building experiences that feel effortless and look exceptional.
            </p>
            <div className="flex items-center gap-3">
              <Button
                href={GITHUB_URL}
                external
                variant="ghost"
                size="sm"
              >
                GitHub
              </Button>
              <Button
                href={LINKEDIN_URL}
                external
                variant="ghost"
                size="sm"
              >
                LinkedIn
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-right">
            <div className={`${brandTheme.components.logo.base} mb-2`}>
              <span className={brandTheme.components.logo.brand}>Ganesh</span>{" "}
              Joshi
            </div>
            <p className={`${brandTheme.components.text.small} text-slate-400`}>
              Full Stack Developer & Creative Problem Solver
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Built with passion and lots of ☕
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">
            © {currentYear} Ganesh Joshi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
