'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { TabNavigation, AlertMessage, LoadingSpinner } from '../../../components';

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateOfBirth?: string;
  ecole?: string;
  promotion?: string;
  ville?: string;
  isActive: boolean;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  studentUsers: number;
  recentUsers: number;
  schoolStats: { _id: string; count: number }[];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // États pour la suppression
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Vérifier l'authentification et le rôle admin
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Utiliser directement les données du contexte au lieu d'un appel API supplémentaire
    if (user?.role !== 'admin') {
      router.push('/profil');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Fonctions de fetch optimisées avec useCallback pour éviter les re-créations
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/admin/users', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          role: roleFilter
        },
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role, currentPage, searchTerm, roleFilter]);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/admin/users/stats', {
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
  }, [isAuthenticated, user?.role]);

  // Charger les données seulement quand nécessaire
  useEffect(() => {
    // Ne charger que si l'utilisateur est authentifié et admin
    if (!isAuthenticated || user?.role !== 'admin') return;

    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, fetchUsers, fetchStats, isAuthenticated, user?.role]);

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteLoading(userId);
      setError('');
      setSuccess('');

      const response = await axios.delete(`http://localhost:5001/api/admin/users/${userId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setSuccess('Utilisateur supprimé avec succès');
        setShowDeleteConfirm(null);
        // Recharger la liste des utilisateurs
        fetchUsers();
        // Recharger les statistiques si on est sur l'onglet stats
        if (activeTab === 'stats') {
          fetchStats();
        }
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = (userId: string, userName: string) => {
    setShowDeleteConfirm(userId);
    setUserToDelete({id: userId, name: userName});
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
    setUserToDelete(null);
  };

  // Configuration des onglets
  const tabs = [
    {
      id: 'users',
      label: 'Gestion des utilisateurs',
      onClick: () => setActiveTab('users'),
      isActive: activeTab === 'users'
    },
    {
      id: 'stats',
      label: 'Statistiques',
      onClick: () => setActiveTab('stats'),
      isActive: activeTab === 'stats'
    }
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Vérification de l'authentification..." />;
  }

  if (loading && !users.length && !stats) {
    return <LoadingSpinner fullScreen text="Chargement des données..." />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl pt-20">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">Administration des utilisateurs</h1>

      <TabNavigation tabs={tabs} />

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {/* Onglet Gestion des utilisateurs */}
      {activeTab === 'users' && (
        <div>
          {/* Barre d'outils */}
          <div className="bg-card shadow-sm rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-md flex-1"
                />
                
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="student">Étudiants</option>
                  <option value="admin">Administrateurs</option>
                </select>
              </div>
              
              <button
                onClick={() => alert('Fonctionnalité de création à implémenter')}
                className="bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all"
              >
                Créer un utilisateur
              </button>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-card shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      École
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((currentUser) => (
                    <tr key={currentUser._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {currentUser.firstName} {currentUser.lastName}
                          </div>
                          {currentUser.promotion && (
                            <div className="text-sm text-gray-500">
                              Promotion {currentUser.promotion}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currentUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          currentUser.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {currentUser.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          currentUser.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {currentUser.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currentUser.ecole || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {currentUser._id !== user?.id ? (
                          <button
                            onClick={() => confirmDelete(currentUser._id, `${currentUser.firstName} ${currentUser.lastName}`)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                            disabled={deleteLoading === currentUser._id}
                          >
                            {deleteLoading === currentUser._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                <span>Suppression...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Supprimer</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Votre compte</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 10, pagination.total)}
                      </span>{' '}
                      sur <span className="font-medium">{pagination.total}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage} sur {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Suivant
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglet Statistiques */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Utilisateurs</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actifs</span>
                <span className="font-semibold text-green-600">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inactifs</span>
                <span className="font-semibold text-red-600">{stats.inactiveUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Rôles</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Étudiants</span>
                <span className="font-semibold text-blue-600">{stats.studentUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Administrateurs</span>
                <span className="font-semibold text-purple-600">{stats.adminUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Activité</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nouveaux (30j)</span>
                <span className="font-semibold text-green-600">{stats.recentUsers}</span>
              </div>
            </div>
          </div>

          {stats.schoolStats.length > 0 && (
            <div className="bg-card shadow-sm rounded-lg p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium mb-4">Répartition par école</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.schoolStats.map((school, index) => (
                  <div key={index} className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">{school._id}</span>
                    <span className="font-semibold">{school.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.name}</strong> ? Cette action est irréversible et supprimera définitivement toutes les données associées à cet utilisateur.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                disabled={deleteLoading === showDeleteConfirm}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              >
                {deleteLoading === showDeleteConfirm ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Supprimer définitivement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 