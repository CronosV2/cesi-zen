'use client';

import Link from 'next/link';

export default function Tools() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Outil d'Évaluation du Stress
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Évaluez votre niveau de stress avec le questionnaire scientifique Holmes-Rahe, 
            reconnu mondialement pour mesurer l'impact des événements de vie sur votre bien-être.
          </p>
        </div>

        {/* Questionnaire Holmes-Rahe Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Questionnaire Holmes-Rahe
                </h2>
                <p className="text-gray-600">
                  Échelle d'évaluation du stress psychosocial
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                Scientifique
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Évaluation complète</h3>
                <p className="text-gray-600 text-sm">43 événements de vie analysés selon leur impact sur le stress</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Basé sur 12 mois</h3>
                <p className="text-gray-600 text-sm">Analyse les événements vécus durant l'année écoulée</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Résultats détaillés</h3>
                <p className="text-gray-600 text-sm">Score personnalisé avec recommandations adaptées</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800">À savoir</h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ce questionnaire est un outil d'auto-évaluation. Les résultats ne remplacent pas un diagnostic médical professionnel. 
              En cas de stress important, consultez un professionnel de santé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/outils/holmes-rahe"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-center hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Commencer le questionnaire
            </Link>
            <Link 
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all duration-200 border border-gray-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Information supplémentaire */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              À propos du questionnaire Holmes-Rahe
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
              Développé par les psychiatres Thomas Holmes et Richard Rahe en 1967, cette échelle mesure 
              l'impact des événements de vie majeurs sur le niveau de stress. Elle est largement utilisée 
              en psychologie et en médecine préventive pour identifier les personnes à risque de développer 
              des problèmes de santé liés au stress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 