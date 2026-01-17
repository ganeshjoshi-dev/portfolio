"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import brandTheme from "@/styles/brand-theme";
import { Button } from "@/components/ui";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Tools", href: "/tools" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-700/60"
          : "bg-transparent"
      }`}
    >
      <div
        className="absolute left-0 top-0 h-1 bg-cyan-400/60 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className={brandTheme.components.container.base}>
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={`${brandTheme.components.logo.base} text-white hover:${brandTheme.colors.text.accent} ${brandTheme.transitions.base} flex align-middle items-center gap-4`}
            >
              <div className="logo-name">
                <span className={brandTheme.components.logo.brand}>Ganesh</span>{" "}
                Joshi
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-6">
              {navLinks.map((link) => {
                const isActive = 
                  link.href === "/" 
                    ? pathname === "/" 
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${brandTheme.components.nav.link} px-3 py-2 text-sm font-medium relative group ${
                      isActive ? "text-cyan-300" : ""
                    }`}
                  >
                    {link.name}
                    <span
                      className={`${brandTheme.components.nav.linkUnderline} ${
                        isActive ? "w-full" : ""
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </div>
            <Button
              href="/contact"
              variant="secondary"
              size="md"
              className="hidden lg:inline-flex"
            >
              Let&apos;s Talk
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${brandTheme.components.nav.link} p-2`}
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden ${brandTheme.transitions.base} ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 rounded-b-lg bg-slate-900/80 border border-slate-700/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`${brandTheme.components.nav.link} hover:bg-slate-800/50 block px-6 py-3 text-base font-medium rounded-lg`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Let&apos;s Talk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
