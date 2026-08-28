import { motion } from 'framer-motion'
import { Target, Award, Heart } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Compassion', text: 'Every patient receives care with dignity and empathy.' },
  { icon: Target, title: 'Excellence', text: 'We follow global standards in treatment and hygiene.' },
  { icon: Award, title: 'Innovation', text: 'Latest medical technology for accurate diagnosis.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">About Us</span>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Caring for communities since 2001</h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          MediCare+ is a multi-specialty hospital committed to accessible, affordable, and quality healthcare.
          Our team of dedicated professionals works round the clock to ensure the best outcomes for every patient.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
        <motion.img
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src="https://images.unsplash.com/photo-1586773867418-d95a08559124?w=700&h=500&fit=crop"
          alt="Medical team"
          className="rounded-3xl shadow-xl"
        />
        <div className="space-y-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ x: 8 }}
              className="flex gap-4 rounded-2xl border border-teal-100 bg-teal-50/30 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
                <v.icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{v.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
