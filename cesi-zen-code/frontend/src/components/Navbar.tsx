'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/vercel.svg"
                alt="Logo"
                width={32}
                height={32}
                className="transform transition-transform duration-300 group-hover:rotate-180 invert"
              />
              <span className="ml-2 text-xl font-bold text-white relative">
                CESI Zen
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden px-3 py-2 text-sm font-medium text-white hover:text-white transition-all duration-200"
                >
                  <span className="relative z-10">{item.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 rounded-md"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 transition-all duration-200 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-full bg-white transform transition duration-500 ease-in-out ${
                    isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-full bg-white transform transition duration-500 ease-in-out ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-full bg-white transform transition duration-500 ease-in-out ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden block px-3 py-2 text-base font-medium text-white hover:text-white transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">{item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
                <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 rounded-md"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 