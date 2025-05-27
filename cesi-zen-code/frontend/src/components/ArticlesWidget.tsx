'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function ArticlesWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());

  const toggleArticle = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/articles/public/featured?limit=2');
        setArticles(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        // Articles par défaut en cas d'erreur
        setArticles([
          {
            _id: '1',
            title: 'Gérer son stress pendant les examens',
            excerpt: 'Découvrez des techniques efficaces pour rester zen pendant la période d\'examens.',
            content: 'La période d\'examens peut être particulièrement stressante pour les étudiants. Voici quelques techniques éprouvées pour gérer votre stress :\n\n1. **Planification et organisation** : Créez un planning de révisions réaliste et respectez-le. Divisez vos matières en petites sessions d\'étude.\n\n2. **Techniques de respiration** : Pratiquez la respiration profonde. Inspirez pendant 4 secondes, retenez pendant 4 secondes, expirez pendant 6 secondes.\n\n3. **Activité physique** : Même 15 minutes de marche par jour peuvent considérablement réduire votre niveau de stress.\n\n4. **Sommeil de qualité** : Maintenez un rythme de sommeil régulier. Évitez les écrans 1h avant le coucher.\n\n5. **Alimentation équilibrée** : Évitez la caféine excessive et privilégiez les aliments riches en oméga-3 et magnésium.',
            author: 'Dr. Martin',
            category: 'conseil',
            publishedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            title: 'Nouvelle session de méditation',
            excerpt: 'Rejoignez-nous pour une session de méditation guidée chaque mercredi.',
            content: 'Nous sommes ravis d\'annoncer le lancement de nos nouvelles sessions de méditation guidée !\n\n**Détails de l\'événement :**\n- **Quand** : Tous les mercredis de 18h à 19h\n- **Où** : Salle de détente du campus CESI\n- **Animateur** : Sarah, instructrice certifiée en mindfulness\n\n**Au programme :**\n- Méditation de pleine conscience\n- Techniques de relaxation progressive\n- Exercices de visualisation\n- Moment d\'échange et de partage\n\n**Pourquoi participer ?**\nLa méditation régulière peut vous aider à :\n- Réduire le stress et l\'anxiété\n- Améliorer votre concentration\n- Développer votre bien-être émotionnel\n- Mieux gérer la pression des études\n\n**Inscription gratuite** pour tous les étudiants CESI. Places limitées à 20 participants par session.',
            author: 'Équipe CESI-ZEN',
            category: 'evenement',
            publishedAt: new Date().toISOString(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'actualite': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'conseil': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'evenement': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'sante': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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

  if (isLoading) {
    return (
      <div className="space-y-4 h-full">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-r from-cyan-300 to-blue-500 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-40 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse p-4 rounded-xl border border-border/50">
              <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
              <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-300 to-blue-500 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
            Actualités & Conseils
          </h3>
          <p className="text-sm text-foreground/60">Restez informé sur le bien-être</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {articles.length > 0 ? (
          articles.map((article) => {
            const isExpanded = expandedArticles.has(article._id);
            return (
              <div
                key={article._id}
                className="block p-4 rounded-xl border border-border/50 transition-all duration-200 bg-card/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                    {getCategoryLabel(article.category)}
                  </span>
                  <span className="text-xs text-foreground/60">
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                <h4 className="font-semibold text-base mb-2 line-clamp-2 leading-tight">
                  {article.title}
                </h4>
                
                {!isExpanded ? (
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                ) : (
                  <div className="text-sm text-foreground/70 mb-3 leading-relaxed max-h-64 overflow-y-auto">
                    {article.content ? (
                      <div className="prose prose-sm max-w-none">
                        {article.content.split('\n').map((paragraph, index) => {
                          if (paragraph.trim() === '') return <br key={index} />;
                          
                          // Gestion du markdown simple
                          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <h5 key={index} className="font-semibold text-foreground mt-3 mb-2">
                                {paragraph.slice(2, -2)}
                              </h5>
                            );
                          }
                          
                          // Gestion des listes
                          if (paragraph.startsWith('- ')) {
                            return (
                              <li key={index} className="ml-4 mb-1">
                                {paragraph.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                              </li>
                            );
                          }
                          
                          // Paragraphe normal avec gestion du gras
                          return (
                            <p 
                              key={index} 
                              className="mb-2"
                              dangerouslySetInnerHTML={{
                                __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <p>{article.excerpt}</p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60 font-medium">
                    Par {article.author}
                  </span>
                  <button
                    onClick={() => toggleArticle(article._id)}
                    className="inline-flex items-center text-xs text-primary hover:text-primary/80 transition-colors font-medium group"
                  >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                    <svg 
                      className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : 'group-hover:translate-x-1'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="p-4 bg-muted/30 rounded-xl">
              <svg className="w-12 h-12 text-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-sm text-foreground/60">Aucun article disponible</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border/30">
        <Link
          href="/actualites"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors font-medium group"
        >
          Voir toutes les actualités
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 