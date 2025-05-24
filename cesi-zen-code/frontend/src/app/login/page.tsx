'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FormInput, AlertMessage } from '../../components';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        console.log('Connexion réussie');
        setSuccess(true);
        
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
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
        
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message="Connexion réussie ! Redirection en cours..." />}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          
          <FormInput
            label="Mot de passe"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-cyan-300 hover:bg-blue-600'} text-white py-2 px-4 rounded-md transition duration-200`}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Pas encore de compte ? <Link href="/register" className="text-blue-500 hover:underline">S'inscrire</Link>
            </p>
          </div>
          
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
