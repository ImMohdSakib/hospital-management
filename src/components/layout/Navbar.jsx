import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, HeartPulse } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 glass border-b border-teal-100/50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ rotate: 12, scale: 1.05 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/30"
          >
            <HeartPulse size={22} />
          </motion.span>
          <span className="text-lg font-bold tracking-tight text-teal-900">
            MediCare<span className="text-teal-600">+</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-teal-700' : 'text-slate-600 hover:text-teal-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-teal-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/appointment"
            className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
          >
            Book Appointment
          </Link>
          <Link
            to="/webadmin/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-teal-600"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-teal-100 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-slate-700 hover:bg-teal-50"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/appointment"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-teal-600 px-3 py-2.5 text-center font-semibold text-white"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
