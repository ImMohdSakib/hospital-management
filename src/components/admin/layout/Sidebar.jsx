import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  UserCog,
  Stethoscope,
  Users,
  CalendarDays,
  Contact,
  Settings,
  LogOut,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/webadmin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/webadmin/admin-list', icon: UserCog, label: 'Admins' },
  { to: '/webadmin/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/webadmin/patients', icon: Users, label: 'Patients' },
  { to: '/webadmin/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/webadmin/contacts', icon: Contact, label: 'Contacts' },
  // { to: '/webadmin/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="admin-gradient relative flex h-screen flex-col border-r border-slate-700/50 text-slate-300"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-700/50 p-4">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <HeartPulse className="text-teal-400" size={28} />
            <span className="font-bold text-white">Admin</span>
          </motion.div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-700/50"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-teal-600/20 text-teal-300' : 'hover:bg-slate-700/40 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-active"
                    className="absolute inset-0 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="relative z-10 shrink-0" />
                {!collapsed && <span className="relative z-10">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700/50 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-700/40 hover:text-white"
        >
          <LogOut size={20} />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </motion.aside>
  )
}
