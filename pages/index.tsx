import Link from 'next/link';

export default function MainMenu() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-6">Welcome to the Migration Helper!</h1>
      <Link href="/preferences">
        <button className="px-4 py-2 bg-primary text-surface rounded-medium shadow-medium hover:bg-accent">
          Find a Place to Migrate
        </button>
      </Link>
    </div>
  );
}
