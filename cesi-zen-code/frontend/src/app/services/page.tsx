'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Services() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du formulaire
    router.push('/thank-you'); // Redirection
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      {/* <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
        Nos Services
      </h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Service 1', 'Service 2', 'Service 3'].map((service, index) => (
          <div key={index} className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-3">{service}</h2>
            <p>Description du service...</p>
          </div>
        ))}
      </div>
      <Link href="/about">À propos</Link>
    </div>
  );
} 