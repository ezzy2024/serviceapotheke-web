import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNews(response.data);
      } catch (err) {
        console.error('Failed to fetch news', err);
        setError('Nachrichten konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-[var(--neo-shadow)] backdrop-blur-md h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl text-indigo-400">
          <Newspaper className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
          Branchen-News
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400/80 py-4 text-sm">{error}</div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">Keine Nachrichten verfügbar.</div>
        ) : (
          news.map((item, idx) => (
            <a 
              key={idx}
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="text-[15px] font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 flex-shrink-0 transition-colors mt-1" />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-purple-400/80">{item.source}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: de })}
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
