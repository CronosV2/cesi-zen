'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { LoadingSpinner, AlertMessage } from '../../../components';

// Types
interface HolmesRaheStats {
  totalResults: number;
  riskDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
  averageScore: number;
  recentResults: number;
}

export default function AdminHolmesRaheResultsPage() {
  const [stats, setStats] = useState<HolmesRaheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Vérifier l'authentification et le rôle admin
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/profil');
      return;
    }

    fetchStats();
  }, [isAuthenticated, isLoading, user, router]);

  const fetchStats = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/holmes-rahe/admin/stats', {
        withCredentials: true
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const getRiskPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0';
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Vérification de l'authentification..." />;
  }

  if (loading && !stats) {
    return <LoadingSpinner fullScreen text="Chargement des statistiques..." />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">Configuration des Résultats - Diagnostic Stress</h1>
        <p className="text-foreground/70">
          Configurez les seuils et analysez les résultats des diagnostics de stress.
        </p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => router.push('/admin/holmes-rahe/events')}
            className="bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Gérer les événements
          </button>
          <button
            onClick={() => router.push('/outils/holmes-rahe')}
            className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            Voir le questionnaire
          </button>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} />}

      {stats && (
        <div className="space-y-6">
          {/* Configuration des seuils */}
          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Configuration des seuils de risque</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-green-800 font-semibold mb-2">🟢 Risque faible</div>
                  <div className="text-sm text-green-600 mb-3">
                    Score inférieur à <strong>150 points</strong>
                  </div>
                  <div className="text-xs text-green-700">
                    Recommandation : Maintenir l'équilibre actuel, activités préventives
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-yellow-800 font-semibold mb-2">🟡 Risque modéré</div>
                  <div className="text-sm text-yellow-600 mb-3">
                    Score entre <strong>150 et 299 points</strong>
                  </div>
                  <div className="text-xs text-yellow-700">
                    Recommandation : Techniques de gestion du stress, surveillance
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-red-800 font-semibold mb-2">🔴 Risque élevé</div>
                  <div className="text-sm text-red-600 mb-3">
                    Score de <strong>300 points ou plus</strong>
                  </div>
                  <div className="text-xs text-red-700">
                    Recommandation : Consultation professionnelle, mesures immédiates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  📊
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total des diagnostics</p>
                  <p className="text-2xl font-bold">{stats.totalResults}</p>
                </div>
              </div>
            </div>

            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  📈
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Score moyen</p>
                  <p className="text-2xl font-bold">{Math.round(stats.averageScore)}</p>
                  <p className="text-xs text-foreground/60">points</p>
                </div>
              </div>
            </div>

            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  🕒
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Récents (30j)</p>
                  <p className="text-2xl font-bold">{stats.recentResults}</p>
                </div>
              </div>
            </div>

            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  ⚠️
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Risque élevé</p>
                  <p className="text-2xl font-bold">{stats.riskDistribution.high}</p>
                  <p className="text-xs text-foreground/60">
                    {getRiskPercentage(stats.riskDistribution.high, stats.totalResults)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition des risques */}
          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Analyse de la répartition</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-green-800">Risque faible</p>
                    <p className="text-sm text-green-600">&lt; 150 points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800">
                    {stats.riskDistribution.low}
                  </p>
                  <p className="text-sm text-green-600">
                    {getRiskPercentage(stats.riskDistribution.low, stats.totalResults)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-yellow-800">Risque modéré</p>
                    <p className="text-sm text-yellow-600">150-299 points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-800">
                    {stats.riskDistribution.moderate}
                  </p>
                  <p className="text-sm text-yellow-600">
                    {getRiskPercentage(stats.riskDistribution.moderate, stats.totalResults)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-red-800">Risque élevé</p>
                    <p className="text-sm text-red-600">≥ 300 points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-800">
                    {stats.riskDistribution.high}
                  </p>
                  <p className="text-sm text-red-600">
                    {getRiskPercentage(stats.riskDistribution.high, stats.totalResults)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Barre de progression visuelle */}
            <div className="mt-6">
              <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ 
                    width: `${getRiskPercentage(stats.riskDistribution.low, stats.totalResults)}%` 
                  }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ 
                    width: `${getRiskPercentage(stats.riskDistribution.moderate, stats.totalResults)}%` 
                  }}
                ></div>
                <div 
                  className="bg-red-500"
                  style={{ 
                    width: `${getRiskPercentage(stats.riskDistribution.high, stats.totalResults)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Configuration du questionnaire diagnostic de stress */}
          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Configuration du questionnaire diagnostic de stress</h3>
            <p className="text-foreground/70 mb-6">
              Gérez les événements et leurs points associés pour personnaliser le diagnostic de stress.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    ⚙️
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">Événements / Points associés</h4>
                    <p className="text-sm text-blue-600">Administrateur</p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm text-blue-700 mb-4">
                  <li>• Ajouter de nouveaux événements de stress</li>
                  <li>• Modifier les points associés (1-100)</li>
                  <li>• Organiser par catégories (Famille, Travail, etc.)</li>
                  <li>• Activer/désactiver des événements</li>
                  <li>• Supprimer des événements obsolètes</li>
                </ul>
                
                <button
                  onClick={() => router.push('/admin/holmes-rahe/events')}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔧 Configurer les événements
                </button>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    📊
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Configuration actuelle</h4>
                    <p className="text-sm text-green-600">Aperçu du système</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total événements :</span>
                    <span className="font-medium text-green-800">36 événements</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Catégories :</span>
                    <span className="font-medium text-green-800">6 catégories</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Points minimum :</span>
                    <span className="font-medium text-green-800">11 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Points maximum :</span>
                    <span className="font-medium text-green-800">100 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Seuils de risque :</span>
                    <span className="font-medium text-green-800">150 / 300</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-700">
                    ✅ Configuration basée sur l'échelle Holmes-Rahe scientifique
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions de configuration */}
          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Actions de configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/holmes-rahe/events')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-blue-600 text-xl mb-2">⚙️</div>
                <h4 className="font-medium mb-1">Gérer les événements</h4>
                <p className="text-sm text-foreground/70">Modifier les événements et leurs points</p>
              </button>
              
              <button
                onClick={fetchStats}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-green-600 text-xl mb-2">🔄</div>
                <h4 className="font-medium mb-1">Actualiser les données</h4>
                <p className="text-sm text-foreground/70">Recharger les statistiques</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/users')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-purple-600 text-xl mb-2">👥</div>
                <h4 className="font-medium mb-1">Voir les utilisateurs</h4>
                <p className="text-sm text-foreground/70">Gérer les utilisateurs à risque</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 