'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  category: 'actualite' | 'conseil' | 'evenement' | 'sante';
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'actualite' | 'conseil' | 'evenement' | 'sante';
  isPublished: boolean;
  isFeatured: boolean;
  imageUrl: string;
  tags: string[];
}

export default function AdminArticlesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'actualite',
    isPublished: false,
    isFeatured: false,
    imageUrl: '',
    tags: []
  });

  // Vérification des droits d'accès
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Chargement des articles
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchArticles();
    }
  }, [isAuthenticated, user]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/api/articles/admin', {
        withCredentials: true
      });
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        // Modification
        await axios.put(
          `http://localhost:5001/api/articles/admin/${editingArticle._id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        // Création
        await axios.post(
          'http://localhost:5001/api/articles/admin',
          formData,
          { withCredentials: true }
        );
      }
      
      setShowModal(false);
      setEditingArticle(null);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: '', // Sera chargé séparément
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
      imageUrl: '',
      tags: []
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/articles/admin/${id}`, {
        withCredentials: true
      });
      setDeleteConfirm(null);
      fetchArticles();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5001/api/articles/admin/${id}/toggle-publish`, {}, {
        withCredentials: true
      });
      fetchArticles();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      category: 'actualite',
      isPublished: false,
      isFeatured: false,
      imageUrl: '',
      tags: []
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'actualite': return 'Actualité';
      case 'conseil': return 'Conseil';
      case 'evenement': return 'Événement';
      case 'sante': return 'Santé';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'actualite': return 'bg-blue-100 text-blue-800';
      case 'conseil': return 'bg-green-100 text-green-800';
      case 'evenement': return 'bg-purple-100 text-purple-800';
      case 'sante': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
              Gestion des Articles
            </h1>
            <p className="text-foreground/70 mt-2">
              Gérez les actualités et informations de la plateforme
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingArticle(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            + Nouvel Article
          </button>
        </div>

        {/* Tableau des articles */}
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Titre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Auteur</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                      Aucun article trouvé
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article._id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{article.title}</div>
                          <div className="text-sm text-foreground/60 line-clamp-1">{article.excerpt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {getCategoryLabel(article.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{article.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            article.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {article.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                          {article.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              En vedette
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">
                        {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => togglePublish(article._id)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              article.isPublished
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {article.isPublished ? 'Dépublier' : 'Publier'}
                          </button>
                          <button
                            onClick={() => handleEdit(article)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article._id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de création/modification */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Titre</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Extrait</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contenu</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Auteur</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Catégorie</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="actualite">Actualité</option>
                        <option value="conseil">Conseil</option>
                        <option value="evenement">Événement</option>
                        <option value="sante">Santé</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                        className="mr-2"
                      />
                      Publier immédiatement
                    </label>
                    
                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="mr-2"
                      />
                      Mettre en vedette
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      {editingArticle ? 'Modifier' : 'Créer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirmer la suppression</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 