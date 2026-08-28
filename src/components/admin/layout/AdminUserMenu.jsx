import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  Shield,
  Mail,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const menuItems = [
  { label: 'My profile', icon: User, to: '/webadmin/profile', desc: 'View account details' },
  { label: 'Hospital settings', icon: Settings, to: '/webadmin/settings' },
  { label: 'Help & support', icon: HelpCircle, href: 'mailto:support@medicareplus.com' },
  { label: 'View public site', icon: Globe, to: '/', external: false },
];

// Helper to get image URL (from environment or localhost)
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:8080${path}`;
};

// Generate initials avatar fallback
const getInitialsAvatar = (name) => {
  if (!name) return 'https://ui-avatars.com/api/?name=User&background=teal&color=fff&size=100';
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=teal&color=fff&size=100`;
};

export default function AdminUserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ---- State for real profile data ----
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Fetch profile on mount ----
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/webadmin/users/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        // Keep existing (null) – will fallback to defaults
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ---- Close dropdown on outside click ----
  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  // ---- Logout handler ----
  const handleSignOut = () => {
    logout();
    navigate('/webadmin/login', { replace: true });
    setOpen(false);
  };

  // ---- Determine display values with fallbacks ----
  const displayName = profile?.name || 'Admin';
  const displayRole = profile?.role || 'Administrator';
  const displayEmail = profile?.email || 'admin@hospital.com';

  // ===================== DATE FORMATTING HELPERS (copy from other pages) =====================

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  const datePart = formatDate(isoString);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${datePart}, ${hours}:${minutes} ${ampm}`;
};

// Then use it for lastLogin:

const displayLastLogin = profile?.lastLogin
  ? formatDateTime(profile.lastLogin)
  : 'N/A';

  // ---- Avatar ----
  const avatarUrl = getImageUrl(profile?.profilePhoto) || getInitialsAvatar(displayName);

  // ---- Loading state – show skeleton ----
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-1.5 pl-1.5 pr-2">
        <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
        <div className="hidden sm:block">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-12 bg-slate-200 rounded animate-pulse mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition ${
          open ? 'bg-teal-50 ring-2 ring-teal-200' : 'hover:bg-slate-100'
        }`}
      >
        <img
          src={avatarUrl}
          alt=""
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow"
        />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-slate-800">{displayName}</p>
          <p className="text-[10px] text-slate-500">{displayRole}</p>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          >
            {/* Header with real data */}
            <div className="border-b border-slate-100 bg-gradient-to-br from-teal-600 to-cyan-600 px-4 py-4 text-white">

              <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 transition rounded-lg p-2 -m-2"
                    onClick={() => {
                      navigate('/webadmin/profile');
                      setOpen(false);
                    }}
                  >  
                          <img
                  src={avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/50"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{displayName}</p>
                  <p className="flex items-center gap-1 text-xs text-teal-100">
                    <Shield size={12} /> {displayRole}
                  </p>
                </div>
              </div>


              <p className="mt-3 flex items-center gap-2 truncate text-xs text-teal-50/90">
                <Mail size={12} /> {displayEmail}
              </p>
              <p className="mt-1 text-[10px] text-teal-100/80">
                Last login: {displayLastLogin}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const content = (
                  <>
                    <item.icon size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      {item.desc && <p className="text-[10px] text-slate-400">{item.desc}</p>}
                    </div>
                  </>
                );
                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50"
                    >
                      {content}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            {/* Sign out */}
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}