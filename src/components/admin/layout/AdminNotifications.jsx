import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CalendarCheck,
  FlaskConical,
  UserPlus,
  Settings,
  CheckCheck,
  X,
  Loader2,
} from 'lucide-react';
import { notificationApi } from '../../../services/notificationService';


import { useAuth } from '../../../context/AuthContext';

const typeStyles = {
  APPOINTMENT: { icon: CalendarCheck, bg: 'bg-teal-100 text-teal-700' },
  PATIENT: { icon: UserPlus, bg: 'bg-blue-100 text-blue-700' },
  LAB: { icon: FlaskConical, bg: 'bg-amber-100 text-amber-700' },
  SYSTEM: { icon: Settings, bg: 'bg-slate-100 text-slate-600' },
  STAFF: { icon: UserPlus, bg: 'bg-violet-100 text-violet-700' },
};

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ref = useRef(null);

  const { token } = useAuth();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getAll();
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Could not load notifications.');
    } finally {
      setLoading(false);
    }
  };

  // Poll every 30 seconds (optional)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationApi.delete(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className={`relative rounded-xl p-2.5 transition ${
          open ? 'bg-teal-50 text-teal-700 ring-2 ring-teal-200' : 'hover:bg-slate-100 text-slate-600'
        }`}
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow"
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3">
              <div>
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                {loading ? (
                  <p className="text-xs text-slate-500">Loading…</p>
                ) : (
                  <p className="text-xs text-slate-500">{unread} unread</p>
                )}
              </div>
              {unread > 0 && !loading && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-teal-700 hover:bg-white/80"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-teal-600" />
                </div>
              ) : error ? (
                <p className="px-4 py-10 text-center text-sm text-red-600">{error}</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-slate-500">No notifications</p>
              ) : (
                items.map((n, i) => {
                  const style = typeStyles[n.type] || typeStyles.SYSTEM;
                  const Icon = style.icon;
                  return (
                    <motion.button
                      key={n.id}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => markRead(n.id)}
                      className={`flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 ${
                        !n.read ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.message}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => remove(n.id, e)}
                        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                        aria-label="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </motion.button>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Link
                to="/webadmin/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                View all →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}