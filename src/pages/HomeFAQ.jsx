import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function HomeFAQ({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-slate-900 hover:bg-slate-50"
            >
              {item.q}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="shrink-0 text-teal-600" size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
