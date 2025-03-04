'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'À propos', href: '/about' },
    { label: 'Nos outils', href: '/outils' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/appzen.png"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>
          </div>

          {/* Centered Menu */}
          <div className="hidden md:flex-1 md:flex md:justify-center">
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden px-3 py-2 text-sm font-medium text-black hover:text-blue-500 transition-all duration-200"
                >
                  <span className="relative z-10">{item.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-black hover:text-blue-500 transition-all duration-200"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md hover:bg-blue-800 transition-all duration-200"
            >
              Inscription
            </Link>
          </div>
        </div>
      </div>  
    </nav>
  );
};

export default Navbar; 