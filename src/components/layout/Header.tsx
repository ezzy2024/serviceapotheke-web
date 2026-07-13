'use client';

import { useAuth } from '@/lib/AuthContext';
import { Bell, LogOut, Menu, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Header() {
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/Notification');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/Notification/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/Notification/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white border-b-2 border-ink sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden text-ink hover:text-ink/70 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-ink uppercase tracking-tight hidden md:block">
          {user?.role === 'Pharmacy' ? 'Apotheken Dashboard' : 'Freelancer Portal'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-ink hover:bg-bone border-2 border-transparent hover:border-ink hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative"
          >
            <Bell className="w-5 h-5 font-bold" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-none border-2 border-ink"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-4 w-80 bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
              <div className="p-4 border-b-2 border-ink flex justify-between items-center bg-bone">
                <h3 className="font-black text-ink uppercase tracking-wide text-sm">Benachrichtigungen</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-ink underline font-bold hover:text-ink/70">
                    Alle gelesen
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    Keine neuen Benachrichtigungen
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full mr-3 shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            {new Date(n.createdAt).toLocaleString('de-DE')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-0.5 bg-ink mx-2"></div>
        
        <button 
          onClick={logout}
          className="flex items-center text-sm font-black uppercase text-ink hover:text-bone hover:bg-ink px-3 py-2 border-2 border-transparent hover:border-ink hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
}
