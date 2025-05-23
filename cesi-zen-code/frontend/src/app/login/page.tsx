'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // Utilisation du contexte d'authentification
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // États pour gérer le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Activation de l'état de chargement
      setIsLoading(true);
      setError('');
      
      // Utilisation de la fonction login du contexte d'authentification
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Connexion réussie
        console.log('Connexion réussie');
        setSuccess(true);
        
        // Redirection après 1 seconde
        setTimeout(() => {
          router.push('/'); // Redirection vers la page d'accueil
        }, 1000);
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      // Gestion des erreurs
      console.error('Erreur lors de la connexion:', err);
      setError(err instanceof Error ? err.message : 'Une erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-300">
          Connexion
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
            Connexion réussie ! Redirection en cours...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {/* Bouton de connexion avec état de chargement */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-cyan-300 hover:bg-blue-600'} text-white py-2 px-4 rounded-md transition duration-200`}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          {/* Lien vers la page d'inscription */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Pas encore de compte ? <Link href="/register" className="text-blue-500 hover:underline">S'inscrire</Link>
            </p>
          </div>
          
          {/* Lien vers la réinitialisation du mot de passe (à implémenter plus tard) */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              <Link href="/forgot-password" className="hover:underline">Mot de passe oublié ?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
