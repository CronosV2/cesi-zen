'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import ArticlesWidget from './ArticlesWidget';

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
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          <path d="M12 6.5c1.38 0 2.5-1.12 2.5-2.5S13.38 1.5 12 1.5 9.5 2.62 9.5 4 10.62 6.5 12 6.5z"/>
        </svg>
      ),
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Actualités & Conseils',
      description: 'Restez informé sur le bien-être',
      href: '/actualites',
      icon: <ArticlesWidget />,
      className: 'md:col-span-3 md:row-span-2',
      isWidget: true,
    },
    {
      title: 'Mon Espace',
      description: '',
      href: '/profil',
      icon: (
        <div className="flex flex-col space-y-3 h-full">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-gray-400'} border-2 border-card`}></span>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-lg font-bold truncate">{profileData?.name || "Visiteur"}</h3>
              <p className="text-xs text-foreground/70 truncate">
                {profileData?.email ? `${profileData.email}` : ''}
              </p>
              <p className="text-xs text-foreground/60 truncate">
                {profileData?.status ? `${profileData.status}` : 'Non connecté'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-border/10 rounded-lg p-3 mt-auto">
            <div className="text-center">
              <p className="text-xs text-foreground/70 mb-1">Niveau</p>
              <p className="text-xl font-bold text-primary">{profileData?.level || 1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/70 mb-1">Exercices</p>
              <p className="text-xl font-bold text-primary">{profileData?.exercicesCompleted || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/70 mb-1">Stress</p>
              <p className={`text-sm font-bold ${profileData?.stressLevel === 'Élevé' ? 'text-red-500' : profileData?.stressLevel === 'Moyen' ? 'text-yellow-500' : 'text-green-500'}`}>
                {profileData?.stressLevel || 'Normal'}
              </p>
            </div>
          </div>
        </div>
      ),
      className: 'md:col-span-1 md:row-span-1',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[60vh]">
        {tools.map((tool) => (
          tool.isWidget ? (
            <div
              key={tool.href}
              className={`group relative overflow-hidden rounded-xl bg-card/50 border border-border p-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 ${tool.className}`}
            >
              <div className="relative z-10 h-full">
                {tool.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/0 to-blue-500/0 group-hover:from-cyan-300/10 group-hover:to-blue-500/10 transition-all duration-300" />
            </div>
          ) : (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative overflow-hidden rounded-xl bg-card/50 border border-border p-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 ${tool.className}`}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="text-primary mb-3">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-200 group-hover:to-blue-400 transition-all">
                  {tool.title}
                </h3>
                <p className="text-sm text-foreground/80">{tool.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/0 to-blue-500/0 group-hover:from-cyan-300/10 group-hover:to-blue-500/10 transition-all duration-300" />
            </Link>
          )
        ))}
      </div>
    </div>
  );
} 
