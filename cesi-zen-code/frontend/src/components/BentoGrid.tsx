'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileData {
  name: string;
  status: string;
  level: number;
  exercicesCompleted: number;
  stressLevel: string;
}

export default function BentoGrid() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/profile/test')
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  const tools = [
    {
      title: 'Méditation',
      description: 'Découvrez nos séances de méditation guidée',
      href: '/outils/meditation',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
        </svg>
      ),
      className: 'md:col-span-1',
    },
    {
      title: 'Journal',
      description: 'Suivez votre progression personnelle',
      href: '/outils/journal',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
          <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
        </svg>
      ),
      className: 'md:col-span-1',
    },
    {
      title: 'Exercices',
      description: 'Pratiquez des exercices de relaxation',
      href: '/outils/exercices',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
        </svg>
      ),
      className: 'md:col-span-2',
    },
    {
      title: 'Mon Espace',
      description: '',
      href: '/profil',
      icon: (
        <div className="flex flex-col space-y-3 -mt-2">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{profileData?.name || "Nathan Darte"}</h3>
              <p className="text-sm text-foreground/70">{profileData?.status || "Étudiant CESI"}</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-border/10 rounded-lg p-2">
            <div className="text-center">
              <p className="text-sm text-foreground/70">Niveau</p>
              <p className="text-lg font-semibold">{profileData?.level || 5}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground/70">Exercice réalisé</p>
              <p className="text-lg font-semibold">{profileData?.exercicesCompleted || 15}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground/70">Stress</p>
              <p className="text-lg text-red-500 font-semibold">{profileData?.stressLevel || "Enorme"}</p>
            </div>
          </div>
        </div>
      ),
      className: 'md:col-span-1 md:row-span-2  md:-mt-42',
    },
    {
      title: 'Musique',
      description: 'Écoutez des musiques apaisantes',
      href: '/outils/musique',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      ),
      className: 'md:col-span-2',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative overflow-hidden rounded-2xl bg-card/50 border border-border p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 ${tool.className}`}
          >
            <div className="relative z-10">
              <div className="text-primary mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-primary group-hover:text-blue-500 transition-colors">
                {tool.title}
              </h3>
              <p className="text-foreground">{tool.description}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/10 transition-all duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
} 