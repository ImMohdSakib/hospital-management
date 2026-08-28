import { motion } from 'framer-motion'
import { Ambulance, Scan, Scissors, Pill, HeartPulse, Video } from 'lucide-react'
import { services } from '../data/mockData'

const iconMap = {
  ambulance: Ambulance,
  scan: Scan,
  scalpel: Scissors,
  pill: Pill,
  heart: HeartPulse,
  video: Video,
}

export default function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">Medical Services</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Comprehensive care departments designed for your complete wellness journey.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = iconMap[s.icon] || HeartPulse
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgb(13 148 136 / 0.15)' }}
              className="group rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-100"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-3 text-white shadow-lg"
              >
                <Icon size={28} />
              </motion.div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
