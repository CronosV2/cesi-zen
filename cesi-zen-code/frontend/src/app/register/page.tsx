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

export default function Register() {
  const router = useRouter();
  // Mise à jour des champs pour correspondre au backend (firstName et lastName au lieu de name)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // États pour gérer le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      // Activation de l'état de chargement
      setIsLoading(true);
      setError('');
      
      // Appel API au backend pour l'inscription avec axios
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      // Avec axios, les données sont directement accessibles via response.data
      const data = response.data;
      
      // Affichage des informations de l'utilisateur créé dans la console (pour débogage)
      console.log('Utilisateur créé:', data.user);
      
      // Inscription réussie
      setSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      // Gestion des erreurs avec axios
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
        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-300">
          Inscription
        </h1>
        
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ prénom */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
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
              Nom
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
              Email
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
              Mot de passe
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
              Confirmer le mot de passe
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
          
          {/* Bouton d'inscription avec état de chargement */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-cyan-300 hover:bg-blue-600'} text-white py-2 px-4 rounded-md transition duration-200`}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
          
          {/* Lien vers la page de connexion */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Déjà inscrit ? <Link href="/login" className="text-blue-500 hover:underline">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 