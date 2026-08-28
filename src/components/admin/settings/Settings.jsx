import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Settings() {
  const [saved, setSaved] = useState(false)

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault()
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }}
      className="max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-100"
    >
      <h2 className="text-lg font-semibold text-slate-800">Hospital settings</h2>
      <div>
        <label className="text-sm text-slate-600">Hospital name</label>
        <input defaultValue="MediCare+ Hospital" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-teal-500 focus:outline-none" />
      </div>
      <div>
        <label className="text-sm text-slate-600">Support email</label>
        <input defaultValue="care@medicareplus.com" type="email" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-teal-500 focus:outline-none" />
      </div>
      <div>
        <label className="text-sm text-slate-600">Emergency helpline</label>
        <input defaultValue="+91 1800-123-4567" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-teal-500 focus:outline-none" />
      </div>
      <label className="flex items-center gap-3">
        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600" />
        <span className="text-sm text-slate-700">Enable online appointment booking</span>
      </label>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="rounded-xl bg-teal-600 px-6 py-2.5 font-medium text-white hover:bg-teal-700"
      >
        {saved ? 'Saved!' : 'Save changes'}
      </motion.button>
    </motion.form>
  )
}
