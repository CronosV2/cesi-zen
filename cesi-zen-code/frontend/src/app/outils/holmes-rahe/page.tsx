'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { LoadingSpinner, AlertMessage, TabNavigation } from '../../../components';
import { refreshProfileDelayed } from '../../../utils/profileUtils';

// Types
interface HolmesRaheEvent {
  _id: string;
  name: string;
  description: string;
  points: number;
  category: string;
}

interface EventCategory {
  category: string;
  label: string;
  events: HolmesRaheEvent[];
}

interface UserResult {
  _id: string;
  totalScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  completedAt: string;
  selectedEvents: {
    eventName: string;
    points: number;
    category: string;
  }[];
}

const HolmesRahePage = () => {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'diagnostics'>('questionnaire');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [anonymousResult, setAnonymousResult] = useState<any>(null);
  
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Charger les événements au montage (toujours accessible)
  useEffect(() => {
    fetchEvents();
  }, []);

  // Charger les diagnostics si utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && activeTab === 'diagnostics') {
      fetchUserResults();
    }
  }, [isAuthenticated, activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/holmes-rahe/events/categories');

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des événements:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResults = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/holmes-rahe/results', {
        withCredentials: true
      });

      if (response.data.success) {
        setUserResults(response.data.results);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des diagnostics:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const calculateCurrentScore = () => {
    return categories.reduce((total, category) => {
      return total + category.events
        .filter(event => selectedEvents.includes(event._id))
        .reduce((sum, event) => sum + event.points, 0);
    }, 0);
  };

  const submitDiagnostic = async () => {
    if (selectedEvents.length === 0) {
      setError('Veuillez sélectionner au moins un événement');
      return;
    }

    if (!isAuthenticated) {
      // Calcul anonyme pour visiteurs
      const score = calculateCurrentScore();
      let riskLevel: 'low' | 'moderate' | 'high';
      if (score < 150) {
        riskLevel = 'low';
      } else if (score >= 150 && score < 300) {
        riskLevel = 'moderate';
      } else {
        riskLevel = 'high';
      }

      setAnonymousResult({
        totalScore: score,
        riskLevel,
        message: 'Connectez-vous pour sauvegarder votre diagnostic et accéder à l\'historique'
      });
      setSuccess('Diagnostic calculé ! Connectez-vous pour le sauvegarder.');
      return;
    }

    // Soumission pour utilisateurs connectés
    try {
      setSubmitLoading(true);
      setError('');
      setSuccess('');
      
      const response = await axios.post('http://localhost:5001/api/holmes-rahe/submit', {
        selectedEventIds: selectedEvents
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setSuccess('Diagnostic sauvegardé avec succès !');
        setSelectedEvents([]);
        setAnonymousResult(null);
        
        // Déclencher le rafraîchissement du profil dans le BentoGrid avec un délai
        refreshProfileDelayed(300);
        
        // Rafraîchir les diagnostics
        if (activeTab === 'diagnostics') {
          fetchUserResults();
        }
      }
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.message || 'Erreur lors de la soumission du diagnostic');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getRiskLevelInfo = (level: string) => {
    switch (level) {
      case 'low':
        return { 
          label: 'Faible', 
          color: 'text-green-600 bg-green-100', 
          description: 'Votre niveau de stress est faible' 
        };
      case 'moderate':
        return { 
          label: 'Modéré', 
          color: 'text-yellow-600 bg-yellow-100', 
          description: 'Votre niveau de stress est modéré' 
        };
      case 'high':
        return { 
          label: 'Élevé', 
          color: 'text-red-600 bg-red-100', 
          description: 'Votre niveau de stress est élevé' 
        };
      default:
        return { 
          label: 'Inconnu', 
          color: 'text-gray-600 bg-gray-100', 
          description: 'Niveau de stress inconnu' 
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'personal':
        return '🧘‍♂️';
      case 'work':
        return '💼';
      case 'financial':
        return '💰';
      case 'health':
        return '🏥';
      case 'social':
        return '🤝';
      default:
        return '📝';
    }
  };

  // Configuration des onglets selon l'authentification
  const tabs = isAuthenticated ? [
    {
      id: 'questionnaire',
      label: 'Questionnaire',
      onClick: () => setActiveTab('questionnaire'),
      isActive: activeTab === 'questionnaire'
    },
    {
      id: 'diagnostics',
      label: 'Mes diagnostics',
      onClick: () => setActiveTab('diagnostics'),
      isActive: activeTab === 'diagnostics'
    }
  ] : [];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement..." />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Questionnaire de Stress Holmes-Rahe</h1>
        <p className="text-foreground/70">
          Évaluez votre niveau de stress en fonction des événements de vie récents.
          {!isAuthenticated && (
            <span className="text-primary font-medium"> Connectez-vous pour sauvegarder vos diagnostics.</span>
          )}
        </p>
      </div>

      {isAuthenticated && <TabNavigation tabs={tabs} />}

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {/* Onglet Questionnaire (toujours visible) */}
      {(!isAuthenticated || activeTab === 'questionnaire') && (
        <div>
          {/* Score actuel */}
          <div className="bg-card shadow-sm rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Score actuel</h3>
                <p className="text-sm text-foreground/70">
                  {selectedEvents.length} événement(s) sélectionné(s)
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {calculateCurrentScore()}
                </div>
                <p className="text-sm text-foreground/70">points</p>
              </div>
            </div>
            
            {selectedEvents.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={submitDiagnostic}
                  disabled={submitLoading}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : isAuthenticated ? (
                    'Sauvegarder le diagnostic'
                  ) : (
                    'Calculer le diagnostic'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Résultat anonyme */}
          {anonymousResult && (
            <div className="bg-card shadow-sm rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Votre diagnostic</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {anonymousResult.totalScore}
                  </div>
                  <div className="text-sm text-foreground/70">points de stress</div>
                  
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                    getRiskLevelInfo(anonymousResult.riskLevel).color
                  }`}>
                    {getRiskLevelInfo(anonymousResult.riskLevel).label}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    {anonymousResult.message}
                  </p>
                  <button
                    onClick={() => router.push('/login')}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Événements par catégorie */}
          {loading ? (
            <LoadingSpinner text="Chargement des événements..." />
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.category} className="bg-card shadow-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-3">{getCategoryIcon(category.category)}</span>
                    {category.label}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.events.map((event) => (
                      <label
                        key={event._id}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          selectedEvents.includes(event._id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event._id)}
                            onChange={() => handleEventToggle(event._id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-sm">{event.name}</h4>
                              <span className="text-primary font-bold text-sm ml-2">
                                {event.points} pts
                              </span>
                            </div>
                            <p className="text-xs text-foreground/70">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Échelle de risque */}
          <div className="bg-card shadow-sm rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium mb-4">Échelle de risque</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-green-600 font-semibold">🟢 Faible risque</div>
                <div className="text-sm text-green-700">Moins de 150 points</div>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="text-yellow-600 font-semibold">🟡 Risque modéré</div>
                <div className="text-sm text-yellow-700">150-299 points</div>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-600 font-semibold">🔴 Risque élevé</div>
                <div className="text-sm text-red-700">300 points ou plus</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Diagnostics (utilisateurs connectés seulement) */}
      {isAuthenticated && activeTab === 'diagnostics' && (
        <div>
          {loading ? (
            <LoadingSpinner text="Chargement de l'historique..." />
          ) : (
            <div className="bg-card shadow-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Historique de vos diagnostics</h3>
              
              {userResults.length === 0 ? (
                <p className="text-foreground/70 text-center py-8">
                  Aucun diagnostic trouvé. Complétez votre premier questionnaire !
                </p>
              ) : (
                <div className="space-y-4">
                  {userResults.map((result) => (
                    <div key={result._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xl font-bold text-primary">
                              {result.totalScore} pts
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getRiskLevelInfo(result.riskLevel).color
                            }`}>
                              {getRiskLevelInfo(result.riskLevel).label}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/70 mt-1">
                            {result.selectedEvents.length} événements sélectionnés
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-foreground/70">
                            {new Date(result.completedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HolmesRahePage; 