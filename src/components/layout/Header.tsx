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
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden text-slate-500 hover:text-slate-700 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 hidden md:block">
          {user?.role === 'Pharmacy' ? 'Apotheken Dashboard' : 'Freelancer Portal'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800">Benachrichtigungen</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    Alle als gelesen markieren
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
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full mr-3 shrink-0 ${!n.isRead ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
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
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button 
          onClick={logout}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
}
