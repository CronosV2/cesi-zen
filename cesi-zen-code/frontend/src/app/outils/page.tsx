export default function Tools() {
  const tools = [
    {
      name: 'Méditation guidée',
      description: 'Des sessions de méditation pour tous les niveaux',
      icon: '🧘‍♂️',
    },
    {
      name: 'Journal de bien-être',
      description: 'Suivez votre progression et vos émotions',
      icon: '📔',
    },
    {
      name: 'Exercices de respiration',
      description: 'Techniques de respiration pour la relaxation',
      icon: '🫁',
    },
    {
      name: 'Musique relaxante',
      description: 'Une sélection de musiques apaisantes',
      icon: '🎵',
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12 text-blue-500">
          Nos Outils de Bien-être
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h2 className="text-xl font-semibold mb-2 text-blue-500">{tool.name}</h2>
              <p className="text-gray-600">{tool.description}</p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                Accéder
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 