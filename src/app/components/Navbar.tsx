"use client";
import Link from "next/link";
import { useState } from "react";
import brandTheme from "@/styles/brand-theme";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${brandTheme.components.gradients.main} backdrop-blur-sm border-b border-gray-700/50`}>
      <div className={brandTheme.components.container.base}>
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className={`${brandTheme.components.logo.base} text-white hover:${brandTheme.colors.text.accent} ${brandTheme.transitions.base} flex align-middle items-center gap-4`}>
           
              <div className="logo-name"><span className={brandTheme.components.logo.brand}>Ganesh</span> Joshi</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${brandTheme.components.nav.link} px-3 py-2 text-sm font-medium relative group`}
                >
                  {link.name}
                  <span className={brandTheme.components.nav.linkUnderline}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${brandTheme.components.nav.link} p-2`}
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} origin-center ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`bg-current block h-0.5 w-6 rounded-sm ${brandTheme.transitions.base} origin-center ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${brandTheme.transitions.base} ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className={`px-2 pt-2 pb-3 space-y-1 ${brandTheme.components.gradients.overlay} rounded-b-lg`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`${brandTheme.components.nav.link} hover:bg-gray-800/50 block px-6 py-3 text-base font-medium rounded-lg`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}