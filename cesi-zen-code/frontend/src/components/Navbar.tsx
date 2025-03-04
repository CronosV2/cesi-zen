'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    { label: 'À propos', href: '/about' },
    {label: 'Nos outils',
      href: '/outils',
      submenu: [
        { label: 'Méditations', href: '/outis/meditations'},
        { label: 'Journal', href: '/outils/journal'},
        { label: 'exercices', href: '/outils/exercices'},
        { label: 'Musique', href: '/outils/musique'}
      ] 
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <div className="flex-shrink-0 mt-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/appzen.png"
                alt="Logo"
                width={80}
                height={80}
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-cyan-300 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex-1 md:flex md:justify-center">
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <div 
                  key={item.href} 
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="group relative overflow-hidden px-3 py-2 text-base font-medium text-black hover:text-cyan-300 transition-all duration-200"
                  >
                    <span className="relative z-10">
                      {item.label}
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-300 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                  
                  {item.submenu && (
                    <div 
                      className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transform transition-all duration-200 ease-in-out ${
                        activeDropdown === item.label 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors duration-200"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-base font-medium text-black hover:text-blue-500 transition-all duration-200"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-base font-medium text-white bg-cyan-300  rounded-md hover:bg-blue-800 transition-all duration-200"
            >
              Inscription
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="pl-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-center text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-base font-medium text-center text-white bg-cyan-300 rounded-md hover:bg-blue-800 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>  
    </nav>
  );
};

export default Navbar; 