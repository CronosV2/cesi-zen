'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

// Configuration d'axios avec l'URL de base
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Permet de gérer les cookies entre les domaines
});

// Énumération pour suivre les étapes du formulaire
enum FormStep {
  ACCOUNT_INFO = 0,   // Informations du compte (prénom, nom, email, mot de passe)
  PERSONAL_INFO = 1,  // Informations personnelles (date de naissance, école, etc.)
  CONFIRMATION = 2    // Étape de confirmation et de succès
}

export default function Register() {
  const router = useRouter();
  
  // État pour suivre l'étape actuelle du formulaire
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_INFO);
  
  // Formulaire complet avec toutes les données
  const [formData, setFormData] = useState({
    // Étape 1 : Informations du compte
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Étape 2 : Informations personnelles
    dateOfBirth: '',
    ecole: '',
    promotion: '',
    ville: ''
  });
  
  // États pour gérer le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1 as FormStep);
  };

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1 as FormStep);
  };
  
  // Validation de l'étape 1 (sans soumission au serveur)
  const validateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification des champs requis
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Validation de format d'email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Si tout est valide, on passe à l'étape suivante
    setError('');
    goToNextStep();
  };
  
  // Soumission finale du formulaire complet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Activation de l'état de chargement
      setIsLoading(true);
      setError('');
      
      // Préparation des données à envoyer (sans le champ confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;
      
      // Appel API au backend pour l'inscription
      const response = await api.post('/auth/register', dataToSend);
      
      // Avec axios, les données sont directement accessibles via response.data
      const data = response.data;
      
      // Inscription réussie
      setSuccess(true);
      setCurrentStep(FormStep.CONFIRMATION);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      // Gestion des erreurs
      if (axios.isAxiosError(err)) {
        // Erreur provenant d'axios (erreur réseau ou réponse du serveur avec code d'erreur)
        const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'inscription';
        console.error('Erreur d\'inscription:', errorMessage);
        setError(errorMessage);
      } else {
        // Erreur JavaScript standard
        console.error('Erreur inattendue:', err);
        setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Titre avec indicateur d'étape */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-cyan-300">
            {currentStep === FormStep.ACCOUNT_INFO && 'Créer un compte'}
            {currentStep === FormStep.PERSONAL_INFO && 'Informations personnelles'}
            {currentStep === FormStep.CONFIRMATION && 'Inscription réussie'}
          </h1>
          
          {/* Indicateur de progression */}
          <div className="flex space-x-1">
            <div className={`w-3 h-3 rounded-full ${currentStep >= FormStep.ACCOUNT_INFO ? 'bg-cyan-300' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep >= FormStep.PERSONAL_INFO ? 'bg-cyan-300' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep >= FormStep.CONFIRMATION ? 'bg-cyan-300' : 'bg-gray-300'}`}></div>
          </div>
        </div>
        
        {/* Affichage des messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Message de succès */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Inscription réussie ! Redirection vers la page de connexion...
          </div>
        )}
        {/* ÉTAPE 1: Informations du compte */}
        {currentStep === FormStep.ACCOUNT_INFO && (
          <form onSubmit={validateStep1} className="space-y-4">
            {/* Champ prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Champ nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Champ email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Champ mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Champ confirmation de mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Bouton pour passer à l'étape suivante */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-300 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Continuer
            </button>
            
            {/* Lien vers la page de connexion */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Déjà inscrit ? <Link href="/login" className="text-blue-500 hover:underline">Se connecter</Link>
              </p>
            </div>
          </form>
        )}
        
        {/* ÉTAPE 2: Informations personnelles */}
        {currentStep === FormStep.PERSONAL_INFO && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date de naissance */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            {/* École */}
            <div>
              <label htmlFor="ecole" className="block text-sm font-medium text-gray-700 mb-1">
                École
              </label>
              <input
                type="text"
                id="ecole"
                value={formData.ecole}
                onChange={(e) => setFormData({ ...formData, ecole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            {/* Promotion */}
            <div>
              <label htmlFor="promotion" className="block text-sm font-medium text-gray-700 mb-1">
                Promotion
              </label>
              <input
                type="text"
                id="promotion"
                value={formData.promotion}
                onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            {/* Ville */}
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex space-x-3">
              {/* Bouton pour revenir à l'étape précédente */}
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={isLoading}
                className="w-1/3 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Retour
              </button>
              
              {/* Bouton de validation finale */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 bg-cyan-300 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                {isLoading ? 'Inscription en cours...' : 'Terminer l\'inscription'}
              </button>
            </div>
          </form>
        )}
        
        {/* ÉTAPE 3: Confirmation */}
        {currentStep === FormStep.CONFIRMATION && (
          <div className="text-center py-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">Inscription réussie !</h2>
            
            <p className="text-gray-600">
              Merci de votre inscription. Vous allez être redirigé vers la page de connexion pour accéder à votre compte.
            </p>
            
            <div className="pt-4">
              <Link href="/login" className="text-cyan-500 hover:underline">
                Aller à la page de connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}