'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { TabNavigation, LoadingSpinner, FormInput, AlertMessage } from '../../components';

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
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    // Ne pas rediriger si on est encore en train de charger l'authentification
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
    
    console.log('Tentative de changement de mot de passe:', { 
      ...passwordData, 
      currentPassword: '***', 
      newPassword: '***', 
      confirmPassword: '***' 
    });
    
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
      console.log('Envoi de la requête de changement de mot de passe...');
      const response = await axios.post(
        'http://localhost:5001/api/profile/change-password',
        passwordData,
        { withCredentials: true }
      );

      console.log('Réponse reçue:', response.data);

      if (response.data.success) {
        setSuccess('Mot de passe modifié avec succès');
        // Réinitialiser le formulaire
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // Si le serveur renvoie un succès=false avec un message
        setError(response.data.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err: any) {
      console.error('Erreur détaillée lors du changement de mot de passe:', err);
      
      // Afficher les détails de l'erreur pour le débogage
      if (err.response) {
        // Le serveur a répondu avec un statut d'erreur
        console.error('Données de réponse:', err.response.data);
        console.error('Statut HTTP:', err.response.status);
        setError(err.response.data.message || `Erreur ${err.response.status}: Échec du changement de mot de passe`);
      } else if (err.request) {
        // La requête a été envoyée mais pas de réponse
        console.error('Pas de réponse reçue du serveur');
        setError('Le serveur ne répond pas. Veuillez réessayer plus tard.');
      } else {
        // Erreur lors de la configuration de la requête
        console.error('Erreur de configuration:', err.message);
        setError(`Erreur: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Configuration des onglets
  const tabs = [
    {
      id: ProfileTab.INFO,
      label: 'Informations',
      onClick: () => handleTabChange(ProfileTab.INFO),
      isActive: activeTab === ProfileTab.INFO
    },
    {
      id: ProfileTab.EDIT,
      label: 'Modifier le profil',
      onClick: () => handleTabChange(ProfileTab.EDIT),
      isActive: activeTab === ProfileTab.EDIT
    },
    {
      id: ProfileTab.PASSWORD,
      label: 'Changer le mot de passe',
      onClick: () => handleTabChange(ProfileTab.PASSWORD),
      isActive: activeTab === ProfileTab.PASSWORD
    }
  ];

  // Ajouter l'onglet Administration pour les admins
  if (profile?.role === 'admin') {
    tabs.push({
      id: 'admin' as any, // Type plus permissif pour les onglets spéciaux
      label: 'Administration',
      onClick: () => router.push('/admin'),
      isActive: false
    });
  }

  // Afficher un message de chargement pour l'authentification
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Vérification de l'authentification..." />;
  }

  // Afficher un message de chargement
  if (loading && !profile) {
    return <LoadingSpinner fullScreen text="Chargement du profil..." />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl pt-20">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <TabNavigation tabs={tabs} />

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

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
              
              {[
                { label: 'Date de naissance', value: profile.dateOfBirth },
                { label: 'École', value: profile.ecole },
                { label: 'Promotion', value: profile.promotion },
                { label: 'Ville', value: profile.ville }
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-sm text-foreground/70">{item.label}</p>
                  <p>{item.value || 'Non renseigné'}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Statistiques</h3>
              
              {[
                { label: 'Niveau', value: profile.level || 1, className: 'text-lg font-semibold' },
                { label: 'Exercices réalisés', value: profile.exercicesCompleted || 0, className: 'text-lg font-semibold' },
                { 
                  label: 'Niveau de stress', 
                  value: profile.stressLevel || 'Normal', 
                  className: `text-lg font-semibold ${
                    profile.stressLevel === 'Élevé' ? 'text-red-500' : 
                    profile.stressLevel === 'Moyen' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`
                }
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-sm text-foreground/70">{item.label}</p>
                  <p className={item.className}>{item.value}</p>
                </div>
              ))}
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
              <FormInput
                label="Prénom"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                label="Nom"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <FormInput
              label="Date de naissance"
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="École"
                id="ecole"
                name="ecole"
                value={formData.ecole}
                onChange={handleInputChange}
              />
              
              <FormInput
                label="Promotion"
                id="promotion"
                name="promotion"
                value={formData.promotion}
                onChange={handleInputChange}
              />
            </div>
            
            <FormInput
              label="Ville"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Enregistrement..." />
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
            <FormInput
              label="Mot de passe actuel"
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <FormInput
              label="Nouveau mot de passe"
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              helpText="Le mot de passe doit contenir au moins 6 caractères"
            />
            
            <FormInput
              label="Confirmer le nouveau mot de passe"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Modification..." />
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
