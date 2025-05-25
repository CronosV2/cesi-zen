'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface ProfileData {
  name: string;
  status: string;
  level: number;
  exercicesCompleted: number;
  stressLevel: string;
  // Nouveaux champs
  ecole?: string;
  promotion?: string;
  ville?: string;
  dateOfBirth?: string;
  email?: string;
}

export default function BentoGrid() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth(); // Utilisation du contexte d'authentification

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Utiliser l'endpoint approprié selon l'état d'authentification
      const endpoint = isAuthenticated 
        ? 'http://localhost:5001/api/profile/data'  // Données réelles pour utilisateurs connectés
        : 'http://localhost:5001/api/profile/test'; // Données de test pour visiteurs
      
      const response = await axios.get(endpoint, { 
        withCredentials: true // Nécessaire pour envoyer les cookies
      });
      
      if (response.data) {
        console.log('Données de profil chargées:', response.data);
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // Charger des données par défaut en cas d'erreur
      setProfileData({
        name: "Visiteur",
        status: "Non connecté",
        level: 1,
        exercicesCompleted: 0,
        stressLevel: "Normal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [isAuthenticated]); // Recharger quand l'état d'authentification change

  // Écouter les événements de rafraîchissement du profil
  useEffect(() => {
    const handleProfileRefresh = () => {
      if (isAuthenticated) {
        fetchProfileData();
      }
    };

    // Ajouter l'event listener
    window.addEventListener('refreshProfile', handleProfileRefresh);

    // Nettoyer l'event listener
    return () => {
      window.removeEventListener('refreshProfile', handleProfileRefresh);
    };
  }, [isAuthenticated]);

  const tools = [
    {
      title: 'Test Holmes-Rahe',
      description: 'Évaluez votre niveau de stress',
      href: '/outils/holmes-rahe',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          <path d="M12 6.5c1.38 0 2.5-1.12 2.5-2.5S13.38 1.5 12 1.5 9.5 2.62 9.5 4 10.62 6.5 12 6.5z"/>
        </svg>
      ),
      className: 'md:col-span-1',
    },
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
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-gray-400'} border-2 border-card`}></span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{profileData?.name || "Visiteur"}</h3>
              <p className="text-sm text-foreground/70">
                {profileData?.email ? `${profileData.email}` : ''}
                {profileData?.status ? ` | ${profileData.status}` : ''}
              </p>
              {profileData?.ecole && (
                <p className="text-xs text-foreground/60">
                  {profileData.ecole}
                  {profileData.promotion ? ` - ${profileData.promotion}` : ''}
                  {profileData.ville ? ` - ${profileData.ville}` : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center bg-border/10 rounded-lg p-2">
            <div className="text-center">
              <p className="text-sm text-foreground/70">Niveau</p>
              <p className="text-lg font-semibold">{profileData?.level || 1}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground/70">Exercices réalisés</p>
              <p className="text-lg font-semibold">{profileData?.exercicesCompleted || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground/70">Stress</p>
              <p className={`text-lg font-semibold ${profileData?.stressLevel === 'Élevé' ? 'text-red-500' : profileData?.stressLevel === 'Moyen' ? 'text-yellow-500' : 'text-green-500'}`}>
                {profileData?.stressLevel || "Normal"}
              </p>
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
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-200 group-hover:to-blue-400 transition-all">
                {tool.title}
              </h3>
              <p className="text-foreground">{tool.description}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/0 to-blue-500/0 group-hover:from-cyan-300/10 group-hover:to-blue-500/10 transition-all duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
} 
