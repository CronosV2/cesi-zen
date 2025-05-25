'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import axios from 'axios';
import { LoadingSpinner, AlertMessage } from '../../../../components';

// Types
interface HolmesRaheEvent {
  _id: string;
  name: string;
  description: string;
  points: number;
  category: 'family' | 'personal' | 'work' | 'financial' | 'health' | 'social';
  isActive: boolean;
}

export default function AdminHolmesRaheEventsPage() {
  const [events, setEvents] = useState<HolmesRaheEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEvent, setEditingEvent] = useState<HolmesRaheEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: 0,
    category: 'personal' as 'family' | 'personal' | 'work' | 'financial' | 'health' | 'social',
    isActive: true
  });
  
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

    fetchEvents();
  }, [isAuthenticated, isLoading, user, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/holmes-rahe/admin/events', {
        withCredentials: true
      });

      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des événements:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      if (editingEvent) {
        // Modification
        const response = await axios.put(
          `http://localhost:5001/api/holmes-rahe/admin/events/${editingEvent._id}`,
          formData,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setSuccess('Événement modifié avec succès');
          setEditingEvent(null);
        }
      } else {
        // Création
        const response = await axios.post(
          'http://localhost:5001/api/holmes-rahe/admin/events',
          formData,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setSuccess('Événement créé avec succès');
        }
      }
      
      setShowForm(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (event: HolmesRaheEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      points: event.points,
      category: event.category,
      isActive: event.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      setError('');
      
      const response = await axios.delete(
        `http://localhost:5001/api/holmes-rahe/admin/events/${eventId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuccess('Événement supprimé avec succès');
        fetchEvents();
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      points: 0,
      category: 'personal' as 'family' | 'personal' | 'work' | 'financial' | 'health' | 'social',
      isActive: true
    });
    setEditingEvent(null);
  };

  const cancelEdit = () => {
    setShowForm(false);
    resetForm();
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      family: 'Famille',
      personal: 'Personnel',
      work: 'Travail',
      financial: 'Finances',
      health: 'Santé',
      social: 'Social'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'personal': return '🧘‍♂️';
      case 'work': return '💼';
      case 'financial': return '💰';
      case 'health': return '🏥';
      case 'social': return '🤝';
      default: return '📝';
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Vérification de l'authentification..." />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration des Événements - Diagnostic Stress</h1>
        <p className="text-foreground/70">
          Gérez les événements et leurs points de stress associés.
        </p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            ➕ Ajouter un événement
          </button>
          <button
            onClick={() => router.push('/admin/holmes-rahe')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Voir les résultats
          </button>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="bg-card shadow-sm rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom de l'événement</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="family">👨‍👩‍👧‍👦 Famille</option>
                  <option value="personal">🧘‍♂️ Personnel</option>
                  <option value="work">💼 Travail</option>
                  <option value="financial">💰 Finances</option>
                  <option value="health">🏥 Santé</option>
                  <option value="social">🤝 Social</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Points de stress (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  Événement actif
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingEvent ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des événements */}
      {loading ? (
        <LoadingSpinner text="Chargement des événements..." />
      ) : (
        <div className="space-y-6">
          {['family', 'personal', 'work', 'financial', 'health', 'social'].map(category => {
            const categoryEvents = events.filter(event => event.category === category);
            
            if (categoryEvents.length === 0) return null;
            
            return (
              <div key={category} className="bg-card shadow-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                  {getCategoryLabel(category)}
                  <span className="ml-2 text-sm text-foreground/70">
                    ({categoryEvents.length} événements)
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {categoryEvents.map((event) => (
                    <div
                      key={event._id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        event.isActive 
                          ? 'border-gray-200 bg-white' 
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium text-lg">{event.name}</h4>
                            <span className="ml-2 px-2 py-1 bg-primary text-white text-sm font-bold rounded">
                              {event.points} pts
                            </span>
                            {!event.isActive && (
                              <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-xs rounded">
                                Inactif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70">{event.description}</p>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(event)}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="mt-8 bg-card shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Statistiques des événements</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-sm text-blue-700">Total événements</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.isActive).length}
            </div>
            <div className="text-sm text-green-700">Événements actifs</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.points, 0) / events.length) : 0}
            </div>
            <div className="text-sm text-yellow-700">Points moyens</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...events.map(e => e.points), 0)}
            </div>
            <div className="text-sm text-purple-700">Points maximum</div>
          </div>
        </div>
      </div>
    </div>
  );
} 