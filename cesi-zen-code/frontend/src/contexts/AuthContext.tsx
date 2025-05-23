'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Définition du type User
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
};

// Définition des propriétés du contexte d'authentification
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

// Création du contexte avec des valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  checkAuth: async () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Configuration d'axios pour les appels API
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Important pour les cookies
});

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de l'authentification
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('Utilisateur authentifié:', response.data.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Erreur de vérification d\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        await checkAuth(); // Mettre à jour l'état d'authentification
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  // Fonction d'inscription
  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Vérifier l'authentification au chargement initial
  useEffect(() => {
    checkAuth();
  }, []);

  // Valeurs fournies par le contexte
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
