import Link from 'next/link';

export default function MarketingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                ServiceApotheke
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/fuer-apotheken" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Für Apotheken
            </Link>
            <Link href="/fuer-apotheker" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Für Apotheker
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md hover:shadow-blue-600/20"
            >
              Loslegen
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
