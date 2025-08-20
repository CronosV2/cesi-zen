import { Inter, Roboto } from 'next/font/google';

// Police principale - Inter de Google Fonts (similaire à Marianne)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Police alternative - Roboto
export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Export marianne pointant vers inter pour compatibilité
export const marianne = inter; 