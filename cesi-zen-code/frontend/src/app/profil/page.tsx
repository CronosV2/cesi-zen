'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

// Définition des types
interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateOfBirth?: string;
  ecole?: string;
  promotion?: string;
  ville?: string;
  level?: number;
  exercicesCompleted?: number;
  stressLevel?: string;
}

// Définition des onglets disponibles
enum ProfileTab {
  INFO = 'info',
  EDIT = 'edit',
  PASSWORD = 'password'
}

export default function ProfilePage() {
  // État pour stocker les données de profil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // État pour gérer les formulaires
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ecole: '',
    promotion: '',
    ville: ''
  });
  
  // État pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // États pour gérer le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.INFO);

  // Utilisation du contexte d'authentification et du router
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Charger les données de profil
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/profile/full', {
          withCredentials: true
        });
        
        if (response.data.success && response.data.user) {
          setProfile(response.data.user);
          
          // Initialiser le formulaire avec les données existantes
          setFormData({
            firstName: response.data.user.firstName || '',
            lastName: response.data.user.lastName || '',
            dateOfBirth: response.data.user.dateOfBirth || '',
            ecole: response.data.user.ecole || '',
            promotion: response.data.user.promotion || '',
            ville: response.data.user.ville || ''
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Impossible de charger les données de profil');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  // Gérer le changement d'onglet
  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  // Gérer les changements dans le formulaire de profil
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Soumettre les modifications du profil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:5001/api/profile/update',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProfile(response.data.user);
        setSuccess('Profil mis à jour avec succès');
      }
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Vérifier que les nouveaux mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    // Vérifier la longueur minimale
    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:5001/api/profile/change-password',
        passwordData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Mot de passe modifié avec succès');
        // Réinitialiser le formulaire
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err: any) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  // Afficher un message de chargement
  if (loading && !profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Profil</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {/* Navigation des onglets */}
      <div className="flex space-x-2 mb-6 border-b">
        <button
          onClick={() => handleTabChange(ProfileTab.INFO)}
          className={`py-2 px-4 ${activeTab === ProfileTab.INFO ? 'border-b-2 border-primary text-primary font-medium' : 'text-foreground/70'}`}
        >
          Informations
        </button>
        <button
          onClick={() => handleTabChange(ProfileTab.EDIT)}
          className={`py-2 px-4 ${activeTab === ProfileTab.EDIT ? 'border-b-2 border-primary text-primary font-medium' : 'text-foreground/70'}`}
        >
          Modifier le profil
        </button>
        <button
          onClick={() => handleTabChange(ProfileTab.PASSWORD)}
          className={`py-2 px-4 ${activeTab === ProfileTab.PASSWORD ? 'border-b-2 border-primary text-primary font-medium' : 'text-foreground/70'}`}
        >
          Changer le mot de passe
        </button>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}

      {/* Affichage des informations du profil */}
      {activeTab === ProfileTab.INFO && profile && (
        <div className="bg-card shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-6">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-foreground/70">{profile.email}</p>
              <p className="text-foreground/70">{profile.role === 'admin' ? 'Administrateur' : 'Étudiant'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Informations personnelles</h3>
              
              <div>
                <p className="text-sm text-foreground/70">Date de naissance</p>
                <p>{profile.dateOfBirth || 'Non renseigné'}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/70">École</p>
                <p>{profile.ecole || 'Non renseigné'}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/70">Promotion</p>
                <p>{profile.promotion || 'Non renseigné'}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/70">Ville</p>
                <p>{profile.ville || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Statistiques</h3>
              
              <div>
                <p className="text-sm text-foreground/70">Niveau</p>
                <p className="text-lg font-semibold">{profile.level || 1}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/70">Exercices réalisés</p>
                <p className="text-lg font-semibold">{profile.exercicesCompleted || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/70">Niveau de stress</p>
                <p className={`text-lg font-semibold ${
                  profile.stressLevel === 'Élevé' ? 'text-red-500' : 
                  profile.stressLevel === 'Moyen' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {profile.stressLevel || 'Normal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de modification du profil */}
      {activeTab === ProfileTab.EDIT && (
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium">
                Date de naissance
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ecole" className="block text-sm font-medium">
                  École
                </label>
                <input
                  type="text"
                  id="ecole"
                  name="ecole"
                  value={formData.ecole}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="promotion" className="block text-sm font-medium">
                  Promotion
                </label>
                <input
                  type="text"
                  id="promotion"
                  name="promotion"
                  value={formData.promotion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ville" className="block text-sm font-medium">
                Ville
              </label>
              <input
                type="text"
                id="ville"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire de changement de mot de passe */}
      {activeTab === ProfileTab.PASSWORD && (
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Changer mon mot de passe</h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium">
                Mot de passe actuel *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium">
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-foreground/70">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Modification...
                  </>
                ) : (
                  'Changer le mot de passe'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
