import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 text-white">
            <HeartPulse className="text-teal-400" />
            <span className="text-lg font-bold">MediCare+</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Trusted hospital care with modern facilities, expert doctors, and compassionate staff for you and your family.
          </p>
        </motion.div>

        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {['/', '/services', '/doctors', '/appointment'].map((path) => (
              <li key={path}>
                <Link to={path} className="hover:text-teal-400 transition-colors">
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-white">Contact</h3>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-teal-400" /> 123 Health Avenue, Mumbai</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-teal-400" /> +91 1800-123-4567</p>
          <p className="flex items-center gap-2"><Mail size={16} className="text-teal-400" /> care@medicareplus.com</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MediCare+ Hospital Management. All rights reserved.
      </div>
    </footer>
  )
}
