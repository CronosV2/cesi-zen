'use client';

import Link from 'next/link';
import Image from 'next/image';

const tools = [
  {
    title: 'Méditation',
    description: 'Découvrez nos séances de méditation guidée',
    href: '/outils/meditation',
    icon: '🧘‍♂️',
    className: 'md:col-span-1',
  },
  {
    title: 'Journal',
    description: 'Suivez votre progression personnelle',
    href: '/outils/journal',
    icon: '📔',
    className: 'md:col-span-1',
  },
  {
    title: 'Exercices',
    description: 'Pratiquez des exercices de relaxation',
    href: '/outils/exercices',
    icon: '🫁',
    className: 'md:col-span-2',
  },
  {
    title: 'Musique',
    description: 'Écoutez des musiques apaisantes',
    href: '/outils/musique',
    icon: '🎵',
    className: 'md:col-span-1',
  },
];

export default function BentoGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${tool.className}`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-cyan-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-600">{tool.description}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/0 to-cyan-300/0 group-hover:from-cyan-300/10 group-hover:to-cyan-300/10 transition-all duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
} 