import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-center px-4">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8 mx-auto">
        <span className="text-2xl font-bold">404</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Seite nicht gefunden</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/20"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
