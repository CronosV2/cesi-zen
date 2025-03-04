'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/appzen.png"
                alt="CESI Zen Logo"
                width={80}
                height={80}
                className="h-16 w-auto"
              />
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/appzen.png"
              alt="CESI Zen Logo"
              width={80}
              height={80}
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-[#00ffec] transition-colors">
              Accueil
            </Link>
            <div 
              className="relative group"
            >
              <Link
                href="/outils"
                className="text-[#00ffec] hover:text-blue-500 transition-colors flex items-center cursor-pointer"
              >
                Nos outils
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div
                className="absolute top-full left-0 w-48 bg-background rounded-lg shadow-lg transition-all duration-200 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
              >
                <Link
                  href="/outils/meditation"
                  className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors rounded-t-lg"
                >
                  Méditation
                </Link>
                <Link
                  href="/outils/journal"
                  className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors"
                >
                  Journal
                </Link>
                <Link
                  href="/outils/exercices"
                  className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors"
                >
                  Exercices
                </Link>
                <Link
                  href="/outils/musique"
                  className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors rounded-b-lg"
                >
                  Musique
                </Link>
              </div>
            </div>
            <Link href="/services" className="text-foreground hover:text-[#00ffec] transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-foreground hover:text-[#00ffec] transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-foreground hover:text-[#00ffec] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className=" px-4 py-2 rounded-lg text-white"
            >
              Inscription
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground  hover:text-[#00ffec] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-full h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 translate-x-4' : ''
                }`}
              />
              <span
                className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-4 space-y-4 bg-background rounded-lg mt-2">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <Link
              href="/"
              className="block px-4 text-[#00ffec] hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <div className="space-y-2">
              <button
                className="w-full px-4 text-left text-[#00ffec] hover:text-foreground transition-colors flex items-center justify-between"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
              >
                Nos outils
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isToolsOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`pl-8 space-y-2 transition-all duration-300 ${
                  isToolsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <Link
                  href="/outils/meditation"
                  className="block text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Méditation
                </Link>
                <Link
                  href="/outils/journal"
                  className="block text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link
                  href="/outils/exercices"
                  className="block text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Exercices
                </Link>
                <Link
                  href="/outils/musique"
                  className="block text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Musique
                </Link>
              </div>
            </div>
            <Link
              href="/services"
              className="block px-4 text-[#00ffec] hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block px-4 text-[#00ffec] hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 px-4 space-y-2 border-t border-border">
              <Link
                href="/login"
                className="block text-[#00ffec] hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="block bg-[#00ffec] text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 