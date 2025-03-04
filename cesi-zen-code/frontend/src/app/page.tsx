import BentoGrid from "../components/BentoGrid";

export default function Home() {
  return (
    <div className="min-h-screen pt-36">
      <main className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
          Découvrez nos outils de bien-être
        </h1>
        <BentoGrid />
      </main>
    </div>
  );
}
