'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentUsers: number;
}

interface StatCardProps {
  label: string;
  value: number;
  color: {
    border: string;
    text: string;
    bg: string;
  };
  icon: React.ReactNode;
}

// Composant réutilisable pour les cartes de statistiques
const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon }) => (
  <div className={`bg-card shadow-sm rounded-lg p-6 border-l-4 ${color.border}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
      </div>
      <div className={`p-3 ${color.bg} rounded-full`}>
        <svg className={`w-6 h-6 ${color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
    </div>
  </div>
);

// Configuration des statistiques
const getStatsConfig = (stats: DashboardStats) => [
  {
    label: "Total utilisateurs",
    value: stats.totalUsers,
    color: {
      border: "border-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-100"
    },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    )
  },
  {
    label: "Utilisateurs actifs",
    value: stats.activeUsers,
    color: {
      border: "border-green-500",
      text: "text-green-600",
      bg: "bg-green-100"
    },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    )
  },
  {
    label: "Administrateurs",
    value: stats.adminUsers,
    color: {
      border: "border-purple-500",
      text: "text-purple-600",
      bg: "bg-purple-100"
    },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    )
  },
  {
    label: "Nouveaux (30j)",
    value: stats.recentUsers,
    color: {
      border: "border-yellow-500",
      text: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    )
  }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté et admin
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      checkAdminRole();
    }
  }, [isAuthenticated, isLoading, router]);

  const checkAdminRole = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile/full', {
        withCredentials: true
      });
      
      if (response.data.success && response.data.user?.role !== 'admin') {
        router.push('/profil');
      } else {
        loadDashboardStats();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      router.push('/profil');
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/admin/users/stats', {
        withCredentials: true
      });

      if (response.data.success) {
        setStats({
          totalUsers: response.data.stats.totalUsers,
          activeUsers: response.data.stats.activeUsers,
          adminUsers: response.data.stats.adminUsers,
          recentUsers: response.data.stats.recentUsers
        });
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Vérification de l'authentification...</span>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="container mx-auto p-6 max-w-7xl pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">Tableau de bord administrateur</h1>
        <p className="text-foreground/70">
          Bienvenue {user?.firstName} ! Gérez votre plateforme depuis ce tableau de bord.
        </p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsConfig(stats).map((stat, index) => (
            <StatCard key={index} label={stat.label} value={stat.value} color={stat.color} icon={stat.icon} />
          ))}
        </div>
      )}

      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
              <p className="text-sm text-gray-600">Gérer, créer et modifier les comptes utilisateurs</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/admin/users')}
            className="w-full bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-white py-2 px-4 rounded-md transition-all"
          >
            Accéder à la gestion
          </button>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow opacity-60">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full mr-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Gestion du contenu</h3>
              <p className="text-sm text-gray-400">Gérer les exercices et contenus pédagogiques</p>
            </div>
          </div>
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
          >
            Bientôt disponible
          </button>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow opacity-60">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full mr-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Gestion du Questionnaire Holmes-Rahe</h3>
              <p className="text-sm text-gray-400">Gérer les questions et les réponses du questionnaire</p>
            </div>
          </div>
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
          >
            Acc
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 bg-card shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-cyan-200 to-blue-400 text-white px-4 py-2 rounded-md hover:from-cyan-300 hover:to-blue-500 transition-all"
          >
            📊 Voir tous les utilisateurs
          </button>
          <button
            onClick={() => router.push('/admin/users?tab=stats')}
            className="bg-gradient-to-r from-cyan-200 to-blue-400 text-white px-4 py-2 rounded-md hover:from-cyan-300 hover:to-blue-500 transition-all"
          >
            📈 Statistiques détaillées
          </button>
          <button
            onClick={() => router.push('/profil')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            👤 Mon profil
          </button>
        </div>
      </div>
    </div>
  );
} 