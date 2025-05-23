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
  const [isToolsOpen, setIsToolsOpen] = useState(false);
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
            
            {isLoading ? (
              // Afficher un spinner de chargement pendant la vérification de l'authentification
              <div className="w-6 h-6 border-2 border-t-2 border-foreground rounded-full animate-spin" />
            ) : isAuthenticated ? (
              // Menu utilisateur pour les utilisateurs connectés
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-foreground hover:text-[#00ffec] transition-colors"
                >
                  <span>{user?.firstName || 'Utilisateur'}</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Menu déroulant du profil */}
                <div 
                  className={`absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg transition-all duration-200 ${isProfileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                >
                  <Link
                    href="/profil"
                    className="block px-4 py-2 text-foreground hover:text-[#00ffec] transition-colors rounded-t-lg"
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
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-red-500 hover:text-red-700 transition-colors rounded-b-lg"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              // Options d'authentification pour les utilisateurs non connectés
              <>
                <Link
                  href="/login"
                  className="text-foreground hover:text-[#00ffec] transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-white bg-cyan-300 hover:bg-blue-600 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
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
          className={`md:hidden fixed left-0 right-0 top-20 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          style={{
            visibility: isMenuOpen ? 'visible' : 'hidden',
            transitionProperty: 'opacity, transform, visibility',
          }}
        >
          <div className="mx-4 py-4 space-y-4 bg-card backdrop-blur-none rounded-lg shadow-lg border border-border/50">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            
            {/* Afficher les informations de l'utilisateur connecté dans le menu mobile */}
            {isAuthenticated && (
              <div className="px-6 py-2 border-b border-border/30">
                <p className="font-medium text-[#00ffec]">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-foreground/70">{user?.email}</p>
              </div>
            )}
            
            <Link
              href="/"
              className="block px-6 py-2 text-[#00ffec] hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <div className="space-y-2">
              <button
                className="w-full px-6 py-2 text-left text-[#00ffec] hover:text-foreground transition-colors flex items-center justify-between"
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
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isToolsOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="py-2 px-8 space-y-3">
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
            </div>
            {isAuthenticated ? (
              // Options pour les utilisateurs connectés (mobile)
              <>
                <Link
                  href="/profil"
                  className="block px-6 py-2 text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon profil
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-6 py-2 text-[#00ffec] hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administration
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-6 py-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              // Options pour les utilisateurs non connectés (mobile)
              <>
                <Link
                  href="/register"
                  className="block px-6 py-2 text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
                <Link
                  href="/login"
                  className="block px-6 py-2 text-[#00ffec] hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              </>
            )}
            <div className="pt-4 px-6 space-y-3 border-t border-border/50">
              <Link
                href="/services"
                className="block text-[#00ffec] hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="block text-[#00ffec] hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 