'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  // Utilisation du contexte d'authentification
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Configuration du composant une fois monté
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fonction de déconnexion avec gestion de l'interface
  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

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
    <>
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
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-[#00ffec] transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/outils" className="text-[#00ffec] hover:text-blue-500 transition-colors font-medium">
                Nos outils
              </Link>
              <Link href="/services" className="text-foreground hover:text-[#00ffec] transition-colors font-medium">
                Services
              </Link>
              <Link href="/contact" className="text-foreground hover:text-[#00ffec] transition-colors font-medium">
                Contact
              </Link>
            </div>

            {/* Desktop Auth & Theme */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-t-2 border-foreground rounded-full animate-spin" />
              ) : isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="flex items-center space-x-2 text-foreground hover:text-[#00ffec] transition-colors font-medium"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span>{user?.firstName || 'Utilisateur'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-1">
                      <Link
                        href="/profil"
                        className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mon profil
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Administration
                        </Link>
                      )}
                      
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-foreground hover:text-[#00ffec] transition-colors font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-cyan-400 hover:to-blue-600 transition-all font-medium"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 rounded-lg text-foreground hover:text-[#00ffec] transition-colors"
                aria-label="Menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-20 left-0 right-0 bg-card backdrop-blur-sm rounded-lg shadow-lg border border-border/50 mx-4">
            <div className="px-4 py-6 space-y-4">
              {/* User Info (if authenticated) */}
              {isAuthenticated && (
                <div className="pb-4 border-b border-border/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-[#00ffec]">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-foreground/70">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Links */}
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/outils"
                  className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nos outils
                </Link>
                <Link
                  href="/services"
                  className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {/* Auth Section */}
              <div className="pt-4 border-t border-border/50 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profil"
                      className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Administration
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-red-500 hover:text-red-700 transition-colors font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 text-[#00ffec] hover:text-foreground transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="block py-2 px-4 rounded-lg text-white bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-cyan-400 hover:to-blue-600 transition-all font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 