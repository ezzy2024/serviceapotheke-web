import { useState, useEffect } from 'react';
import api from '@/lib/api';
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
        const response = await api.get('/News');
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
          <Newspaper className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Branchen-News
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 w-4 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                  <div className="h-3 bg-slate-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4 text-sm font-medium">{error}</div>
        ) : news.length === 0 ? (
          <div className="text-center text-slate-500 py-4 text-sm font-medium">Keine Nachrichten verfügbar.</div>
        ) : (
          news.map((item, idx) => (
            <a 
              key={idx}
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md hover:border-blue-300">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 transition-colors mt-1" />
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-2">
                  <span className="text-blue-600 px-2.5 py-1 bg-blue-50 rounded-lg">{item.source}</span>
                  <span className="flex items-center gap-1.5 ml-auto">
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
